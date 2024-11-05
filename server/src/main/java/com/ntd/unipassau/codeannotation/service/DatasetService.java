package com.ntd.unipassau.codeannotation.service;

import com.ntd.unipassau.codeannotation.domain.dataset.Dataset;
import com.ntd.unipassau.codeannotation.domain.dataset.Snippet;
import com.ntd.unipassau.codeannotation.domain.dataset.SnippetQuestion;
import com.ntd.unipassau.codeannotation.domain.question.QuestionSet;
import com.ntd.unipassau.codeannotation.domain.rater.DemographicQuestionGroup;
import com.ntd.unipassau.codeannotation.domain.rater.SnippetRate;
import com.ntd.unipassau.codeannotation.mapper.DatasetMapper;
import com.ntd.unipassau.codeannotation.repository.DatasetRepository;
import com.ntd.unipassau.codeannotation.repository.DemographicQuestionGroupRepository;
import com.ntd.unipassau.codeannotation.repository.SnippetRateRepository;
import com.ntd.unipassau.codeannotation.repository.SnippetRepository;
import com.ntd.unipassau.codeannotation.web.rest.errors.NotFoundException;
import com.ntd.unipassau.codeannotation.web.rest.vm.DatasetStatistics;
import com.ntd.unipassau.codeannotation.web.rest.vm.DatasetVM;
import com.ntd.unipassau.codeannotation.web.rest.vm.SubmissionVM;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class DatasetService {
    private final DemographicQuestionGroupRepository dqgRepository;
    private final DatasetRepository datasetRepository;
    private final DatasetMapper datasetMapper;
    private final SnippetRepository snippetRepository;
    private final SnippetRateRepository snippetRateRepository;
    private final RaterMgmtServiceFactory raterMgmtServiceFactory;

    @Autowired
    public DatasetService(
            DemographicQuestionGroupRepository dqgRepository,
            DatasetRepository datasetRepository,
            DatasetMapper datasetMapper,
            SnippetRepository snippetRepository,
            SnippetRateRepository snippetRateRepository,
            RaterMgmtServiceFactory raterMgmtServiceFactory) {
        this.dqgRepository = dqgRepository;
        this.datasetRepository = datasetRepository;
        this.datasetMapper = datasetMapper;
        this.snippetRepository = snippetRepository;
        this.snippetRateRepository = snippetRateRepository;
        this.raterMgmtServiceFactory = raterMgmtServiceFactory;
    }

    @Transactional(readOnly = true)
    public Page<DatasetVM> getDatasetPage(DatasetVM params, Pageable pageable) {
        Page<Long> idPage = datasetRepository.findDatasetIdPage(params, pageable);
        return new PageImpl<>(
                datasetRepository.findAllFetchDQGroups(idPage.getContent())
                        .stream()
                        .map(dataset -> {
                            Set<Long> demographicQuestionIds = dataset.getDQuestionGroups().stream()
                                    .map(QuestionSet::getId)
                                    .collect(Collectors.toSet());
                            DatasetVM datasetVM = datasetMapper.toDatasetVM(dataset);
                            datasetVM.setDemographicQuestionGroupIds(demographicQuestionIds);
                            return datasetVM;
                        })
                        .collect(Collectors.toList()),
                pageable,
                idPage.getTotalElements());
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
        DatasetVM result = datasetMapper.toDatasetVM(dataset);
        result.setDemographicQuestionGroupIds(datasetVM.getDemographicQuestionGroupIds());
        return result;
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
    public Optional<DatasetVM> patchDataset(Long datasetId, DatasetVM newDataset) {
        return datasetRepository.findById(datasetId)
                .map(dataset -> {
                    dataset.setArchived(newDataset.getArchived());
                    return datasetMapper.toDatasetVM(dataset);
                });
    }

    @Transactional
    public DatasetVM updateDataset(Dataset dataset, DatasetVM newDataset) {
        if (dataset.getConfiguration() != null
                && newDataset.getConfiguration() != null) {
            dataset.getConfiguration().forEach((key, subConfig) -> {
                if (!newDataset.getConfiguration().containsKey(key))
                    return;
                Map<String, Object> newSubConfig = newDataset.getConfiguration().get(key);
                subConfig.forEach((subKey, value) -> {
                    // B.c. secrets will not be exposed to FE, this will prevent setting
                    // null value to secrets in case that users did not re-specify secrets.
                    if (subKey.startsWith("secrets")
                            && newSubConfig.getOrDefault(subKey, null) == null) {
                        newSubConfig.put(subKey, value);
                    }
                });
            });
        }
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
        DatasetVM result = datasetMapper.toDatasetVM(dataset);
        result.setDemographicQuestionGroupIds(newDataset.getDemographicQuestionGroupIds());
        return result;
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

    @Transactional
    public Optional<DatasetVM> duplicateDataset(
            Long datasetId, Boolean withSnippet) {
        return datasetRepository.findFetchSnippetQuestionsById(datasetId)
                .map(dataset -> {
                    DatasetVM datasetVM = datasetMapper.toDatasetVM(dataset);
                    final var newDataset = datasetMapper.toDataset(datasetVM);
                    newDataset.setId(null);
                    newDataset.setConfiguration(dataset.getConfiguration());
                    newDataset.setDQuestionGroups(new LinkedHashSet<>(dataset.getDQuestionGroups()));
                    newDataset.getDQuestionGroups()
                            .forEach(dqGroup -> dqGroup.getDatasets().add(newDataset));

                    if (!Boolean.TRUE.equals(withSnippet)) {
                        createDataset(newDataset);
                        return newDataset;
                    }

                    Set<Snippet> newSnippets = dataset.getSnippets().stream()
                            .map(s -> {
                                var newSnippet = new Snippet();
                                BeanUtils.copyProperties(
                                        s, newSnippet,
                                        "id", "dataset", "questions", "rates", "predictedRatings");
                                Set<SnippetQuestion> newQuestions = s.getQuestions().stream()
                                        .map(q -> {
                                            var newQuestion = new SnippetQuestion();
                                            BeanUtils.copyProperties(
                                                    q, newQuestion,
                                                    "id", "snippet", "groupAssignments", "solutions");
                                            newQuestion.setSnippet(newSnippet);
                                            return newQuestion;
                                        })
                                        .collect(Collectors.toSet());
                                newSnippet.setDataset(newDataset);
                                newSnippet.setQuestions(newQuestions);
                                return newSnippet;
                            })
                            .collect(Collectors.toSet());
                    newDataset.setSnippets(newSnippets);

                    createDataset(newDataset);
                    return newDataset;
                })
                .map(dataset -> {
                    DatasetVM result = datasetMapper.toDatasetVM(dataset);
                    result.setDemographicQuestionGroupIds(
                            dataset.getDQuestionGroups().stream()
                                    .map(QuestionSet::getId)
                                    .collect(Collectors.toSet())
                    );
                    return result;
                });
    }

    @Transactional(readOnly = true)
    public Collection<SubmissionVM> listSubmissions(Long datasetId) {
        Dataset dataset = datasetRepository.findById(datasetId)
                .orElseThrow(() -> new NotFoundException(
                        "Could not find dataset by id: " + datasetId, "pathVars", "datasetId"));
        RaterMgmtService raterMgmtService = raterMgmtServiceFactory.create(dataset);
        Collection<SubmissionVM> submissions = raterMgmtService.listSubmissions(dataset);

        int numberOfSnippets = dataset.getSnippets().size();
        long numberOfAttentionCheck = dataset.getSnippets().stream()
                .filter(s -> s.getCorrectRating() != null)
                .count();

        // Enrich attention check results
        Map<UUID, List<Long>> raterRatingsCountMap = snippetRateRepository.countCorrectRatingsByDatasetId(datasetId);
        // Count number of failed attention check that are consistent.
        Map<UUID, Integer> raterATConsistencyCountMap =
                snippetRateRepository.countConsistentFailedAttentionCheckDatasetId(datasetId);

        submissions.forEach(s -> {
            List<Long> counts = raterRatingsCountMap.getOrDefault(s.getRater().getId(), List.of(0L, 0L));
            Integer consistency = raterATConsistencyCountMap.getOrDefault(s.getRater().getId(), 0);
            s.setNumberOfSnippets(numberOfSnippets);
            s.setNumberOfRatings(counts.get(0).intValue());
            s.setTotalAttentionCheck((int) numberOfAttentionCheck);
            s.setPassedAttentionCheck(counts.get(1).intValue());
            s.setConsistentFailedAttentionCheck(consistency);
        });

        return submissions;
    }

    @Transactional(readOnly = true)
    public Optional<DatasetStatistics> getDatasetStatistics(Long datasetId) {
        return datasetRepository.findById(datasetId)
                .map(dataset -> {
                    Collection<Snippet> snippets = snippetRepository.findAllByDatasetId(datasetId);
                    return DatasetStatistics.builder()
                            .dataset(datasetMapper.toDatasetVM(dataset))
                            .numberOfSnippets(snippets.size())
                            .numberOfParticipants(countNumberOfParticipants(snippets))
                            .averageRating(calculateAverageRating(snippets))
                            .snippets(calculateSnippetStatistics(snippets))
                            .build();
                });
    }

    private Map<Long, DatasetStatistics.SnippetStatistics> calculateSnippetStatistics(Collection<Snippet> snippets) {
        return snippets.stream()
                .map(snippet -> {
                    double averageRating = calculateAverageRating(List.of(snippet));
                    int numberOfParticipants = countNumberOfParticipants(List.of(snippet));
                    return Map.entry(
                            snippet.getId(),
                            DatasetStatistics.SnippetStatistics.builder()
                                    .averageRating(averageRating)
                                    .numberOfParticipants(numberOfParticipants)
                                    .build());
                })
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }

    private int countNumberOfParticipants(Collection<Snippet> snippets) {
        return (int) snippets.stream()
                .flatMap(snippet -> snippet.getRates().stream())
                .filter(rating -> rating != null && rating.getValue() != null)
                .map(rating -> rating.getRater().getId())
                .distinct()
                .count();
    }

    private double calculateAverageRating(Collection<Snippet> snippets) {
        return snippets.stream()
                // Ignore attention check snippets
                .filter(snippet -> !snippet.isAttentionCheck())
                .flatMap(snippet -> snippet.getRates().stream())
                .filter(rating -> rating != null && rating.getValue() != null
                        // Do not count if rating was ignored
                        && rating.getValue() > 0)
                .mapToInt(SnippetRate::getValue)
                .average()
                .orElse(0d);
    }
}
