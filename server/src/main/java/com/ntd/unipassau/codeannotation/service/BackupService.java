package com.ntd.unipassau.codeannotation.service;

import com.ntd.unipassau.codeannotation.domain.Dataset;
import com.ntd.unipassau.codeannotation.export.DatasetExporter;
import com.ntd.unipassau.codeannotation.repository.DatasetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class BackupService {
    private final DatasetExporter datasetExporter;
    private final DatasetRepository datasetRepository;

    @Autowired
    public BackupService(
            DatasetExporter datasetExporter,
            DatasetRepository datasetRepository) {
        this.datasetExporter = datasetExporter;
        this.datasetRepository = datasetRepository;
    }

    public Resource exportSnippets(Long datasetId) throws IOException {
        Dataset dataset = datasetRepository.findFetchAllById(datasetId)
                .orElseThrow(() -> new RuntimeException("Could not find dataset by id to export snippets: " + datasetId));
        return datasetExporter.exportSnippets(dataset);
    }
}
