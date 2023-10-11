package com.ntd.unipassau.codeannotation.service;

import com.ntd.unipassau.codeannotation.domain.dataset.Dataset;
import com.ntd.unipassau.codeannotation.repository.DatasetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.Optional;

@Service
public class DatasetService {
    private final DatasetRepository datasetRepository;

    @Autowired
    public DatasetService(DatasetRepository datasetRepository) {
        this.datasetRepository = datasetRepository;
    }

    public Collection<Dataset> getAllDatasets() {
        return datasetRepository.findAll();
    }

    public Optional<Dataset> getById(Long datasetId) {
        return datasetRepository.findById(datasetId);
    }

    @Transactional
    public Dataset createDataset(Dataset dataset) {
        return datasetRepository.save(dataset);
    }

    @Transactional
    public void deleteDataset(Long datasetId) {
        datasetRepository.deleteById(datasetId);
    }
}
