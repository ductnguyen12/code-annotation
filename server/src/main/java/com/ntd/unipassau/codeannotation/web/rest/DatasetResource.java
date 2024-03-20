package com.ntd.unipassau.codeannotation.web.rest;

import com.ntd.unipassau.codeannotation.security.AuthoritiesConstants;
import com.ntd.unipassau.codeannotation.service.BackupService;
import com.ntd.unipassau.codeannotation.service.DatasetService;
import com.ntd.unipassau.codeannotation.web.rest.errors.BadRequestException;
import com.ntd.unipassau.codeannotation.web.rest.errors.NotFoundException;
import com.ntd.unipassau.codeannotation.web.rest.vm.DatasetStatistics;
import com.ntd.unipassau.codeannotation.web.rest.vm.DatasetVM;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Tag(name = "Dataset Resource")
@RestController
public class DatasetResource {
    private final BackupService backupService;
    private final DatasetService datasetService;

    @Autowired
    public DatasetResource(
            BackupService backupService,
            DatasetService datasetService) {
        this.backupService = backupService;
        this.datasetService = datasetService;
    }

    @Operation(summary = "Get dataset page")
    @GetMapping("/v1/datasets")
    public Page<DatasetVM> getDatasets(
            DatasetVM params,
            Pageable pageable) {
        return datasetService.getDatasetPage(params, pageable);
    }

    @Operation(summary = "Create a dataset")
    @PostMapping("/v1/datasets")
    @ResponseStatus(HttpStatus.CREATED)
    public DatasetVM createDataset(@RequestBody @Valid DatasetVM dataset) {
        return datasetService.createDataset(dataset);
    }

    @Operation(summary = "Update a dataset")
    @PutMapping("/v1/datasets/{datasetId}")
    @Secured({AuthoritiesConstants.USER})
    public DatasetVM updateDataset(@PathVariable Long datasetId, @RequestBody @Valid DatasetVM dataset) {
        return datasetService.updateDataset(datasetId, dataset)
                .orElseThrow(() -> new NotFoundException(
                        "Could not find dataset by id: " + datasetId, "pathVars", "datasetId"));
    }

    @Operation(summary = "Partially update a dataset")
    @PatchMapping("/v1/datasets/{datasetId}")
    @Secured({AuthoritiesConstants.USER})
    public DatasetVM patchDataset(@PathVariable Long datasetId, @RequestBody DatasetVM dataset) {
        return datasetService.patchDataset(datasetId, dataset)
                .orElseThrow(() -> new NotFoundException(
                        "Could not find dataset by id: " + datasetId, "pathVars", "datasetId"));
    }

    @Operation(summary = "Get dataset by id")
    @GetMapping("/v1/datasets/{datasetId}")
    @Secured({AuthoritiesConstants.RATER, AuthoritiesConstants.USER})
    public DatasetVM getDataset(@PathVariable Long datasetId) {
        return datasetService.getDatasetById(datasetId)
                .orElseThrow(() -> new NotFoundException(
                        "Could not find dataset by id: " + datasetId, "pathVars", "datasetId"));
    }

    @Operation(summary = "Delete a dataset")
    @DeleteMapping("/v1/datasets/{datasetId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Secured({AuthoritiesConstants.USER})
    public void deleteDataset(@PathVariable Long datasetId) {
        datasetService.deleteDataset(datasetId)
                .orElseThrow(() -> new NotFoundException(
                        "Could not find dataset by id: " + datasetId, "pathVars", "datasetId"));
    }

    @Operation(summary = "Export dataset's snippets and annotation")
    @GetMapping(value = "/v1/datasets/{datasetId}/export-snippets", produces = "application/zip")
    @Secured({AuthoritiesConstants.USER})
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
    @Secured({AuthoritiesConstants.USER})
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

    @Operation(summary = "Get dataset's statistics")
    @GetMapping(value = "/v1/datasets/{datasetId}/statistics")
    @Secured({AuthoritiesConstants.USER})
    public DatasetStatistics getDatasetStatistics(@PathVariable Long datasetId) {
        return datasetService.getDatasetStatistics(datasetId)
                .orElseThrow(() -> new NotFoundException(
                        "Could not find dataset by id: " + datasetId, "pathVars", "datasetId"));
    }
}
