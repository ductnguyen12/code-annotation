package com.ntd.unipassau.codeannotation.service;

import com.ntd.unipassau.codeannotation.domain.dataset.Dataset;
import com.ntd.unipassau.codeannotation.domain.question.QuestionSet;
import com.ntd.unipassau.codeannotation.domain.rater.DemographicQuestionGroup;
import com.ntd.unipassau.codeannotation.mapper.DatasetMapper;
import com.ntd.unipassau.codeannotation.repository.DatasetRepository;
import com.ntd.unipassau.codeannotation.repository.DemographicQuestionGroupRepository;
import com.ntd.unipassau.codeannotation.web.rest.vm.DatasetVM;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class DatasetService {
    private final DemographicQuestionGroupRepository dqgRepository;
    private final DatasetRepository datasetRepository;
    private final DatasetMapper datasetMapper;

    @Autowired
    public DatasetService(
            DemographicQuestionGroupRepository dqgRepository,
            DatasetRepository datasetRepository,
            DatasetMapper datasetMapper) {
        this.dqgRepository = dqgRepository;
        this.datasetRepository = datasetRepository;
        this.datasetMapper = datasetMapper;
    }

    @Transactional(readOnly = true)
    public Collection<DatasetVM> getAllDatasets() {
        return datasetRepository.findAllFetchDQGroups().stream()
                .map(dataset -> {
                    Set<Long> demographicQuestionIds = dataset.getDQuestionGroups().stream()
                            .map(QuestionSet::getId)
                            .collect(Collectors.toSet());
                    DatasetVM datasetVM = datasetMapper.toDatasetVM(dataset);
                    datasetVM.setDemographicQuestionGroupIds(demographicQuestionIds);
                    return datasetVM;
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<DatasetVM> getDatasetById(Long datasetId) {
        return datasetRepository.findById(datasetId)
                .map(dataset -> {
                    Set<Long> demographicQuestionIds = dataset.getDQuestionGroups().stream()
                            .map(QuestionSet::getId)
                            .collect(Collectors.toSet());
                    DatasetVM datasetVM = datasetMapper.toDatasetVM(dataset);
                    datasetVM.setDemographicQuestionGroupIds(demographicQuestionIds);
                    return datasetVM;
                });
    }

    public Optional<Dataset> getById(Long datasetId) {
        return datasetRepository.findById(datasetId);
    }

    @Transactional
    public DatasetVM createDataset(DatasetVM datasetVM) {
        final Dataset dataset = datasetMapper.toDataset(datasetVM);

        Set<DemographicQuestionGroup> dqGroups =
                dqgRepository.findAllFetchDatasetsByIds(datasetVM.getDemographicQuestionGroupIds());
        dqGroups.forEach(dqGroup -> dqGroup.getDatasets().add(dataset));
        dataset.setDQuestionGroups(dqGroups);

        createDataset(dataset);
        return datasetMapper.toDatasetVM(dataset);
    }

    @Transactional
    public Dataset createDataset(Dataset dataset) {
        return datasetRepository.save(dataset);
    }

    @Transactional
    public Optional<DatasetVM> updateDataset(Long datasetId, DatasetVM newDataset) {
        return datasetRepository.findById(datasetId)
                .map(dataset -> updateDataset(dataset, newDataset));
    }

    @Transactional
    public DatasetVM updateDataset(Dataset dataset, DatasetVM newDataset) {
        BeanUtils.copyProperties(newDataset, dataset, "id");

        // Remove old connections
        Set<DemographicQuestionGroup> dQuestionGroups = dqgRepository.findAllFetchDataset(dataset.getId());
        dQuestionGroups.forEach(group -> group.getDatasets().remove(dataset));
        dataset.getDQuestionGroups().clear();

        // Add new connections
        dQuestionGroups = dqgRepository.findAllFetchDatasetsByIds(newDataset.getDemographicQuestionGroupIds());
        dQuestionGroups.forEach(group -> group.getDatasets().add(dataset));
        dataset.getDQuestionGroups().addAll(dQuestionGroups);

        datasetRepository.save(dataset);
        return datasetMapper.toDatasetVM(dataset);
    }

    @Transactional
    public Optional<Dataset> deleteDataset(Long datasetId) {
        return datasetRepository.findById(datasetId)
                .map(dataset -> {
                    Collection<DemographicQuestionGroup> dQuestionGroups =
                            dqgRepository.findAllFetchDataset(datasetId);
                    dQuestionGroups.forEach(group -> group.getDatasets().remove(dataset));
                    dQuestionGroups.clear();
                    datasetRepository.delete(dataset);
                    return dataset;
                });
    }
}
