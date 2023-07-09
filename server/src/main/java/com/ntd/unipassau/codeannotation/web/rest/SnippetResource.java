package com.ntd.unipassau.codeannotation.web.rest;

import com.ntd.unipassau.codeannotation.domain.Dataset;
import com.ntd.unipassau.codeannotation.domain.Snippet;
import com.ntd.unipassau.codeannotation.mapper.SnippetMapper;
import com.ntd.unipassau.codeannotation.service.DatasetService;
import com.ntd.unipassau.codeannotation.service.SnippetService;
import com.ntd.unipassau.codeannotation.web.rest.errors.BadRequestException;
import com.ntd.unipassau.codeannotation.web.rest.errors.NotFoundException;
import com.ntd.unipassau.codeannotation.web.rest.vm.SnippetRateVM;
import com.ntd.unipassau.codeannotation.web.rest.vm.SnippetVM;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

@Tag(name = "Snippet Resource")
@RestController
public class SnippetResource {
    private final DatasetService datasetService;
    private final SnippetService snippetService;
    private final SnippetMapper snippetMapper;

    @Autowired
    public SnippetResource(
            DatasetService datasetService,
            SnippetService snippetService,
            SnippetMapper snippetMapper) {
        this.datasetService = datasetService;
        this.snippetService = snippetService;
        this.snippetMapper = snippetMapper;
    }

    @Operation(summary = "Get dataset snippets")
    @GetMapping("/v1/datasets/{datasetId}/snippets")
    public Collection<SnippetVM> getDatasetSnippets(@PathVariable Long datasetId) {
        return snippetMapper.toSnippetVMs(snippetService.getDatasetSnippets(datasetId));
    }

    @Operation(summary = "Create a snippet")
    @PostMapping("/v1/snippets")
    @ResponseStatus(HttpStatus.CREATED)
    public SnippetVM createSnippet(@RequestBody @Valid SnippetVM snippetVM) {
        Dataset dataset = datasetService.getById(snippetVM.getDatasetId())
                .orElseThrow(() -> new BadRequestException(
                        "Could not find dataset by id: " + snippetVM.getDatasetId(), "snippet", "datasetId"));
        Snippet snippet = snippetMapper.toSnippet(snippetVM);
        snippet.setDataset(dataset);
        return snippetMapper.toSnippetVM(snippetService.createSnippet(snippet));
    }

    @Operation(summary = "Delete a snippet")
    @DeleteMapping("/v1/snippets/{snippetId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteSnippet(@PathVariable Long snippetId) {
        snippetService.getById(snippetId)
                .orElseThrow(() -> new NotFoundException(
                        "Could not find snippet by id: " + snippetId, "pathVars", "snippetId"));
        snippetService.deleteById(snippetId);
    }

    @Operation(summary = "Rate a snippet")
    @PostMapping("/v1/snippets/{snippetId}/rates")
    @ResponseStatus(HttpStatus.CREATED)
    public void createSnippetRate(@PathVariable Long snippetId, @RequestBody @Valid SnippetRateVM rate) {
        Snippet snippet = snippetService.getById(snippetId)
                .orElseThrow(() -> new NotFoundException(
                        "Could not find snippet by id: " + snippetId, "pathVars", "snippetId"));
        snippetService.rateSnippet(rate, snippet);
    }
}
