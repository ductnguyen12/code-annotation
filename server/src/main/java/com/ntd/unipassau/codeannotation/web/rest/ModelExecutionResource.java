package com.ntd.unipassau.codeannotation.web.rest;

import com.ntd.unipassau.codeannotation.security.AuthoritiesConstants;
import com.ntd.unipassau.codeannotation.service.ModelExecutionService;
import com.ntd.unipassau.codeannotation.web.rest.vm.ModelExecutionVM;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Model Execution Resource")
@RestController
public class ModelExecutionResource {
    private final ModelExecutionService executionService;

    @Autowired
    public ModelExecutionResource(
            ModelExecutionService executionService) {
        this.executionService = executionService;
    }

    @Operation(summary = "Get a page of executions")
    @GetMapping("/v1/model-executions")
    @Secured({AuthoritiesConstants.USER})
    public Page<ModelExecutionVM> listExecutions(ModelExecutionVM query, Pageable pageable) {
        return executionService.listExecutions(query, pageable);
    }

    @Operation(summary = "Execute a model")
    @PostMapping("/v1/model-executions")
    @ResponseStatus(HttpStatus.CREATED)
    @Secured({AuthoritiesConstants.USER})
    public ModelExecutionVM createModel(@RequestBody @Valid ModelExecutionVM execution) {
        return executionService.createExecution(execution);
    }
}
