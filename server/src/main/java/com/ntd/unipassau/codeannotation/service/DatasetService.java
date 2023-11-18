package com.ntd.unipassau.codeannotation.service;

import com.ntd.unipassau.codeannotation.domain.dataset.Dataset;
import com.ntd.unipassau.codeannotation.mapper.DatasetMapper;
import com.ntd.unipassau.codeannotation.repository.DatasetRepository;
import com.ntd.unipassau.codeannotation.web.rest.vm.DatasetVM;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.Optional;

@Service
public class DatasetService {
    private final DatasetRepository datasetRepository;
    private final DatasetMapper datasetMapper;

    @Autowired
    public DatasetService(
            DatasetRepository datasetRepository,
            DatasetMapper datasetMapper) {
        this.datasetRepository = datasetRepository;
        this.datasetMapper = datasetMapper;
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
    public DatasetVM updateDataset(Dataset dataset, DatasetVM newDataset) {
        BeanUtils.copyProperties(newDataset, dataset, "id");
        datasetRepository.save(dataset);
        return datasetMapper.toDatasetVM(dataset);
    }

    @Transactional
    public void deleteDataset(Long datasetId) {
        datasetRepository.deleteById(datasetId);
    }
}
