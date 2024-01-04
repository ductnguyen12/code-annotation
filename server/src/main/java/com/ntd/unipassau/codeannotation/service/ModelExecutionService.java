package com.ntd.unipassau.codeannotation.service;

import com.ntd.unipassau.codeannotation.domain.RequestState;
import com.ntd.unipassau.codeannotation.domain.dataset.Dataset;
import com.ntd.unipassau.codeannotation.domain.prediction.Model;
import com.ntd.unipassau.codeannotation.domain.prediction.ModelExecution;
import com.ntd.unipassau.codeannotation.domain.prediction.PredictedRating;
import com.ntd.unipassau.codeannotation.mapper.ModelMapper;
import com.ntd.unipassau.codeannotation.prediction.PredictionFactory;
import com.ntd.unipassau.codeannotation.prediction.executor.ModelExecutor;
import com.ntd.unipassau.codeannotation.repository.DatasetRepository;
import com.ntd.unipassau.codeannotation.repository.ModelExecutionRepository;
import com.ntd.unipassau.codeannotation.repository.ModelRepository;
import com.ntd.unipassau.codeannotation.repository.PredictedRatingRepository;
import com.ntd.unipassau.codeannotation.web.rest.vm.ModelExecutionVM;
import lombok.extern.slf4j.Slf4j;
import org.jobrunr.scheduling.JobBuilder;
import org.jobrunr.scheduling.JobScheduler;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.MessageFormat;
import java.time.Duration;
import java.util.*;

@Service
@Slf4j
public class ModelExecutionService {
    private final static String EXECUTION_TASK_NAME = "executing-model-{0}-on-{1}-id-{2}";
    private final static String EXECUTION_TASK_LABEL = "model-execution";
    private final ModelExecutionRepository executionRepository;
    private final PredictedRatingRepository pRatingRepository;
    private final DatasetRepository datasetRepository;
    private final ModelRepository modelRepository;
    private final ModelMapper modelMapper;

    private final JobScheduler jobScheduler;

    public ModelExecutionService(
            ModelExecutionRepository executionRepository,
            PredictedRatingRepository pRatingRepository,
            DatasetRepository datasetRepository,
            ModelRepository modelRepository,
            ModelMapper modelMapper,
            JobScheduler jobScheduler) {
        this.executionRepository = executionRepository;
        this.pRatingRepository = pRatingRepository;
        this.datasetRepository = datasetRepository;
        this.modelRepository = modelRepository;
        this.modelMapper = modelMapper;
        this.jobScheduler = jobScheduler;
    }

    @Transactional(readOnly = true)
    public Page<ModelExecutionVM> listExecutions(ModelExecutionVM query, Pageable pageable) {
        Page<ModelExecution> executionPage = executionRepository.findAll(
                query.getTargetId(),
                query.getTargetType(),
                query.getModelId(),
                pageable
        );
        List<ModelExecutionVM> executionVMS = executionPage.get()
                .map(modelMapper::toExecutionVM)
                .toList();
        return new PageImpl<>(executionVMS, pageable, executionPage.getTotalElements());
    }

    @Transactional
    public ModelExecutionVM createExecution(ModelExecutionVM executionVM) {
        ModelExecution execution = modelMapper.toExecution(executionVM);
        final UUID taskId = UUID.randomUUID();
        execution.setId(taskId);
        execution.setState(RequestState.PENDING);
        execution = executionRepository.save(execution);

        jobScheduler.create(JobBuilder.aJob()
                .withId(execution.getId())
                .withName(MessageFormat.format(
                        EXECUTION_TASK_NAME,
                        execution.getModelId(), execution.getTargetType().name(), execution.getModelId()
                ))
                .withLabels(Set.of(EXECUTION_TASK_LABEL))
                .scheduleIn(Duration.ZERO)
                .withDetails(() -> executeModel(taskId))
        );

        return modelMapper.toExecutionVM(execution);
    }

    public void executeModel(UUID executionId) {
        Optional<ModelExecution> executionOpt = executionRepository.findById(executionId);
        if (executionOpt.isEmpty()) {
            log.warn("Could not find execution id: {}", executionId);
            return;
        }
        ModelExecution execution = executionOpt.get();
        execution.setState(RequestState.RUNNING);
        executionRepository.saveAndFlush(execution);

        Model model = modelRepository.findById(execution.getModelId())
                .orElseThrow(() -> new RuntimeException(
                        MessageFormat.format("Could not find model id {0} to execute task {1}",
                                execution.getModelId(), executionId)));
        Dataset dataset = datasetRepository.findFetchSnippetsById(execution.getTargetId())
                .orElseThrow(() -> new RuntimeException(
                        MessageFormat.format("Could not find dataset id {0} to execute task {1}",
                                execution.getTargetId(), executionId)));

        ModelExecutor executor = PredictionFactory.create(
                model.getExecutionType(),
                PredictionFactory.create(model.getOutputFormat()));

        try {
            Collection<PredictedRating> predictedRatings = executor.predict(model, dataset);
            predictedRatings.forEach(pr -> pr.setExecution(execution));
            pRatingRepository.saveAll(predictedRatings);
            execution.setState(RequestState.COMPLETED);
        } catch (Exception e) {
            log.error("Error during execute task {}", executionId, e);
            execution.setState(RequestState.ERROR);
            execution.setErrorMsg(e.getMessage());
        }
        executionRepository.save(execution);
    }
}
