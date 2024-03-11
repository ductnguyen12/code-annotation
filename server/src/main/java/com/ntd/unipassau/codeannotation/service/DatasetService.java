package com.ntd.unipassau.codeannotation.service;

import com.ntd.unipassau.codeannotation.domain.dataset.Dataset;
import com.ntd.unipassau.codeannotation.domain.dataset.Snippet;
import com.ntd.unipassau.codeannotation.domain.question.QuestionSet;
import com.ntd.unipassau.codeannotation.domain.rater.DemographicQuestionGroup;
import com.ntd.unipassau.codeannotation.domain.rater.SnippetRate;
import com.ntd.unipassau.codeannotation.mapper.DatasetMapper;
import com.ntd.unipassau.codeannotation.repository.DatasetRepository;
import com.ntd.unipassau.codeannotation.repository.DemographicQuestionGroupRepository;
import com.ntd.unipassau.codeannotation.repository.SnippetRepository;
import com.ntd.unipassau.codeannotation.web.rest.vm.DatasetStatistics;
import com.ntd.unipassau.codeannotation.web.rest.vm.DatasetVM;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
    public DatasetService(
            DemographicQuestionGroupRepository dqgRepository,
            DatasetRepository datasetRepository,
            DatasetMapper datasetMapper,
            SnippetRepository snippetRepository) {
        this.dqgRepository = dqgRepository;
        this.datasetRepository = datasetRepository;
        this.datasetMapper = datasetMapper;
        this.snippetRepository = snippetRepository;
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
                .flatMap(snippet -> snippet.getRates().stream())
                .filter(rating -> rating != null && rating.getValue() != null)
                .mapToInt(SnippetRate::getValue)
                .average()
                .orElse(0d);
    }
}
