package com.ntd.unipassau.codeannotation.service;

import com.ntd.unipassau.codeannotation.domain.dataset.Dataset;
import com.ntd.unipassau.codeannotation.domain.dataset.Snippet;
import com.ntd.unipassau.codeannotation.domain.question.Question;
import com.ntd.unipassau.codeannotation.domain.rater.RaterAction;
import com.ntd.unipassau.codeannotation.domain.rater.Solution;
import com.ntd.unipassau.codeannotation.export.DatasetExporter;
import com.ntd.unipassau.codeannotation.export.ZipUtil;
import com.ntd.unipassau.codeannotation.repository.DatasetRepository;
import com.ntd.unipassau.codeannotation.repository.RaterActionRepository;
import com.ntd.unipassau.codeannotation.repository.SnippetRepository;
import com.ntd.unipassau.codeannotation.repository.SolutionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.text.MessageFormat;
import java.util.Collection;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BackupService {
    private final static String DIR_DATASET_SNIPPETS = "dataset-{0}-snippets";
    private final static String DEMOGRAPHIC_SOLUTIONS_FILENAME = "demographics.json";
    private final static String UNKNOWN_RATERS_FILENAME = "unknown-raters.json";
    private final static String RATERS_ACTIONS_FILENAME = "raters-actions.json";
    private final DatasetExporter datasetExporter;
    private final DatasetRepository datasetRepository;
    private final SolutionRepository solutionRepository;
    private final RaterActionRepository raterActionRepository;
    private final SnippetRepository snippetRepository;
    private final SnippetService snippetService;
    private final RaterMgmtServiceFactory raterMgmtServiceFactory;

    @Autowired
    public BackupService(
            DatasetExporter datasetExporter,
            DatasetRepository datasetRepository,
            SolutionRepository solutionRepository,
            RaterActionRepository raterActionRepository,
            SnippetRepository snippetRepository,
            SnippetService snippetService,
            RaterMgmtServiceFactory raterMgmtServiceFactory) {
        this.datasetExporter = datasetExporter;
        this.datasetRepository = datasetRepository;
        this.solutionRepository = solutionRepository;
        this.raterActionRepository = raterActionRepository;
        this.snippetRepository = snippetRepository;
        this.snippetService = snippetService;
        this.raterMgmtServiceFactory = raterMgmtServiceFactory;
    }

    @Transactional(readOnly = true)
    public Resource exportSnippets(Long datasetId, Collection<UUID> raterIds) throws IOException {
        Dataset dataset = datasetRepository.findFetchAllById(datasetId)
                .orElseThrow(() -> new RuntimeException("Could not find dataset by id to export snippets: " + datasetId));

        Path tmpDir = Files.createTempDirectory(MessageFormat.format(DIR_DATASET_SNIPPETS, dataset.getId()));
        tmpDir.toFile().deleteOnExit();

        // Remove ratings from other raters
        dataset.getSnippets().forEach(s -> {
            s.getRates().removeIf(rating -> raterIds != null && !raterIds.contains(rating.getRaterId()));
        });

        // Export snippet
        datasetExporter.exportSnippets(tmpDir, dataset.getSnippets());

        // Get all solutions of specified raters
        Collection<Solution> dSolutions = getDatasetSolutions(datasetId).stream()
                .filter(s -> raterIds == null || raterIds.contains(s.getRaterId()))
                .toList();

        // Export raters
        RaterMgmtService raterMgmtService = raterMgmtServiceFactory.create(dataset);
        Collection<Solution> verifiedSolutions = raterMgmtService.getVerifiedSolutions(dSolutions);
        datasetExporter.exportDemographicSolutions(
                tmpDir.resolve(DEMOGRAPHIC_SOLUTIONS_FILENAME),
                verifiedSolutions);

        // Export unknown raters
        Set<Solution.SolutionId> verifiedIDs = verifiedSolutions.stream()
                .map(Solution::getId)
                .collect(Collectors.toSet());
        datasetExporter.exportDemographicSolutions(
                tmpDir.resolve(UNKNOWN_RATERS_FILENAME),
                dSolutions.stream().filter(s -> !verifiedIDs.contains(s.getId()))
                        .collect(Collectors.toSet()));

        Collection<RaterAction> raterActions = raterActionRepository.findAllFetchRaterByDatasetId(datasetId);
        datasetExporter.exportRaterActions(tmpDir.resolve(RATERS_ACTIONS_FILENAME), raterActions);

        Path outPath = Files.createTempFile(MessageFormat.format(DIR_DATASET_SNIPPETS, dataset.getId()), ".zip");
        ZipUtil.zipDirectory(tmpDir, outPath);

        return new UrlResource(outPath.toUri());
    }

    @Transactional
    public void importSnippets(Long datasetId, Resource resource) throws IOException {
        // Delete all old snippets
        Collection<Snippet> snippets = snippetRepository.findAllByDatasetId(datasetId);
        snippetService.deleteAllInBatch(snippets);

        // Extract snippet information from import file
        Dataset dataset = datasetRepository.findById(datasetId)
                .orElseThrow(() -> new RuntimeException("Could not find dataset by id to import snippets: " + datasetId));

        // Extract uploaded file to tmp dir
        Path tmpDir = Files.createTempDirectory(MessageFormat.format(DIR_DATASET_SNIPPETS, dataset.getId()));
        ZipUtil.unzip(resource.getInputStream(), tmpDir);

        dataset = datasetExporter.importSnippets(dataset, tmpDir);

        snippetService.createSnippetsInBatch(dataset.getSnippets());
    }

    @Transactional
    public void importSnippets(Long datasetId, Collection<Resource> resources) throws IOException {
        // Delete all old snippets
        Collection<Snippet> snippets = snippetRepository.findAllByDatasetId(datasetId);
        snippetService.deleteAllInBatch(snippets);

        // Extract snippet information from import file
        Dataset dataset = datasetRepository.findById(datasetId)
                .orElseThrow(() -> new RuntimeException("Could not find dataset by id to import snippets: " + datasetId));

        // Extract uploaded file to tmp dir
        Path tmpDir = Files.createTempDirectory(MessageFormat.format(DIR_DATASET_SNIPPETS, dataset.getId()));
        for (var resource : resources) {
            Objects.requireNonNull(resource.getFilename());
            Files.copy(resource.getInputStream(), tmpDir.resolve(resource.getFilename()));
        }

        dataset = datasetExporter.importSnippets(dataset, tmpDir);

        snippetService.createSnippetsInBatch(dataset.getSnippets());
    }

    private Collection<Solution> getDatasetSolutions(Long datasetId) {
        Collection<Solution> dSolutions = solutionRepository.findDemographicSolutionsByDataset(datasetId);
        Collection<Solution> subSolutions = solutionRepository.findAllFetchQuestion(dSolutions.stream()
                .map(Solution::getQuestion)
                .map(Question::getId)
                .collect(Collectors.toSet()));
        dSolutions.addAll(subSolutions);
        return dSolutions;
    }
}
