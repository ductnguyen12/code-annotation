package com.ntd.unipassau.codeannotation.web.rest;

import com.ntd.unipassau.codeannotation.mapper.DatasetMapper;
import com.ntd.unipassau.codeannotation.service.DatasetService;
import com.ntd.unipassau.codeannotation.web.rest.errors.NotFoundException;
import com.ntd.unipassau.codeannotation.web.rest.vm.DatasetVM;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

@Tag(name = "Dataset Resource")
@RestController
public class DatasetResource {
    private final DatasetService datasetService;
    private final DatasetMapper datasetMapper;

    @Autowired
    public DatasetResource(
            DatasetService datasetService,
            DatasetMapper datasetMapper) {
        this.datasetService = datasetService;
        this.datasetMapper = datasetMapper;
    }

    @Operation(summary = "Get all datasets")
    @GetMapping("/v1/datasets")
    public Collection<DatasetVM> getDatasets() {
        return datasetMapper.toDatasetVMs(datasetService.getAllDatasets());
    }

    @Operation(summary = "Create a dataset")
    @PostMapping("/v1/datasets")
    @ResponseStatus(HttpStatus.CREATED)
    public DatasetVM createDataset(@RequestBody @Valid DatasetVM dataset) {
        return datasetMapper.toDatasetVM(datasetService.createDataset(datasetMapper.toDataset(dataset)));
    }

    @Operation(summary = "Delete a dataset")
    @DeleteMapping("/v1/datasets/{datasetId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteDataset(@PathVariable Long datasetId) {
        datasetService.getById(datasetId)
                .orElseThrow(() -> new NotFoundException(
                        "Could not find dataset by id: " + datasetId, "pathVars", "datasetId"));
        datasetService.deleteDataset(datasetId);
    }
}
