package com.ntd.unipassau.codeannotation.service;

import com.ntd.unipassau.codeannotation.domain.dataset.Dataset;
import com.ntd.unipassau.codeannotation.domain.dataset.Snippet;
import com.ntd.unipassau.codeannotation.export.DatasetExporter;
import com.ntd.unipassau.codeannotation.repository.DatasetRepository;
import com.ntd.unipassau.codeannotation.repository.SnippetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.Collection;

@Service
public class BackupService {
    private final DatasetExporter datasetExporter;
    private final DatasetRepository datasetRepository;
    private final SnippetRepository snippetRepository;
    private final SnippetService snippetService;

    @Autowired
    public BackupService(
            DatasetExporter datasetExporter,
            DatasetRepository datasetRepository,
            SnippetRepository snippetRepository,
            SnippetService snippetService) {
        this.datasetExporter = datasetExporter;
        this.datasetRepository = datasetRepository;
        this.snippetRepository = snippetRepository;
        this.snippetService = snippetService;
    }

    public Resource exportSnippets(Long datasetId) throws IOException {
        Dataset dataset = datasetRepository.findFetchAllById(datasetId)
                .orElseThrow(() -> new RuntimeException("Could not find dataset by id to export snippets: " + datasetId));
        return datasetExporter.exportSnippets(dataset);
    }

    @Transactional
    public void importSnippets(Long datasetId, Resource resource) throws IOException {
        // Delete all old snippets
        Collection<Snippet> snippets = snippetRepository.findAllByDatasetId(datasetId);
        snippetService.deleteAllInBatch(snippets);

        // Extract snippet information from import file
        Dataset dataset = datasetRepository.findById(datasetId)
                .orElseThrow(() -> new RuntimeException("Could not find dataset by id to import snippets: " + datasetId));
        dataset = datasetExporter.importSnippets(dataset, resource);

        snippetService.createSnippetsInBatch(dataset.getSnippets());
    }
}
