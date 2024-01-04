package com.ntd.unipassau.codeannotation.web.rest;

import com.ntd.unipassau.codeannotation.security.AuthoritiesConstants;
import com.ntd.unipassau.codeannotation.service.ModelService;
import com.ntd.unipassau.codeannotation.web.rest.errors.NotFoundException;
import com.ntd.unipassau.codeannotation.web.rest.vm.ModelVM;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

@Tag(name = "Model Resource")
@RestController
public class ModelResource {
    private final ModelService modelService;

    @Autowired
    public ModelResource(
            ModelService modelService) {
        this.modelService = modelService;
    }

    @Operation(summary = "Get all models")
    @GetMapping("/v1/models")
    @Secured({AuthoritiesConstants.USER})
    public Collection<ModelVM> listModels() {
        return modelService.listModels();
    }

    @Operation(summary = "Create a model")
    @PostMapping("/v1/models")
    @ResponseStatus(HttpStatus.CREATED)
    @Secured({AuthoritiesConstants.USER})
    public ModelVM createModel(@RequestBody @Valid ModelVM model) {
        return modelService.createModel(model);
    }

    @Operation(summary = "Update a model")
    @PutMapping("/v1/models/{modelId}")
    @Secured({AuthoritiesConstants.USER})
    public ModelVM updateModel(@PathVariable Long modelId, @RequestBody @Valid ModelVM model) {
        return modelService.updateModel(modelId, model)
                .orElseThrow(() -> new NotFoundException(
                        "Could not find model by id: " + modelId, "pathVars", "modelId"));
    }

    @Operation(summary = "Delete a model")
    @DeleteMapping("/v1/models/{modelId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Secured({AuthoritiesConstants.USER})
    public void deleteModel(@PathVariable Long modelId) {
        modelService.deleteModel(modelId)
                .orElseThrow(() -> new NotFoundException(
                        "Could not find model by id: " + modelId, "pathVars", "modelId"));
    }
}
