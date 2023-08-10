package com.ntd.unipassau.codeannotation.web.rest;

import com.ntd.unipassau.codeannotation.mapper.DatasetMapper;
import com.ntd.unipassau.codeannotation.service.BackupService;
import com.ntd.unipassau.codeannotation.service.DatasetService;
import com.ntd.unipassau.codeannotation.web.rest.errors.BadRequestException;
import com.ntd.unipassau.codeannotation.web.rest.errors.NotFoundException;
import com.ntd.unipassau.codeannotation.web.rest.vm.DatasetVM;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collection;

@Tag(name = "Dataset Resource")
@RestController
public class DatasetResource {
    private final BackupService backupService;
    private final DatasetService datasetService;
    private final DatasetMapper datasetMapper;

    @Autowired
    public DatasetResource(
            BackupService backupService,
            DatasetService datasetService,
            DatasetMapper datasetMapper) {
        this.backupService = backupService;
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

    @Operation(summary = "Export dataset's snippets and annotation")
    @GetMapping(value = "/v1/datasets/{datasetId}/export-snippets", produces = "application/zip")
    public ResponseEntity<Resource> exportSnippets(@PathVariable Long datasetId) throws IOException {
        datasetService.getById(datasetId)
                .orElseThrow(() -> new NotFoundException(
                        "Could not find dataset by id: " + datasetId, "pathVars", "datasetId"));
        Resource resource = backupService.exportSnippets(datasetId);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("application/zip"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    @Operation(summary = "Import dataset's snippets and annotation")
    @PostMapping(value = "/v1/datasets/{datasetId}/import-snippets")
    public void importSnippets(
            @PathVariable Long datasetId,
            @RequestParam("file") MultipartFile file) throws IOException {
        datasetService.getById(datasetId)
                .orElseThrow(() -> new NotFoundException(
                        "Could not find dataset by id: " + datasetId, "pathVars", "datasetId"));
        if (!"application/zip".equals(file.getContentType())) {
            throw new BadRequestException(
                    "File content type must be \"application/zip\" instead of " + file.getContentType(), null, null);
        }

        backupService.importSnippets(datasetId, file.getResource());
    }
}
