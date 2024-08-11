package com.ntd.unipassau.codeannotation.web.rest;

import com.ntd.unipassau.codeannotation.security.AuthoritiesConstants;
import com.ntd.unipassau.codeannotation.security.SecurityUtils;
import com.ntd.unipassau.codeannotation.service.RaterActionService;
import com.ntd.unipassau.codeannotation.web.rest.errors.BadRequestException;
import com.ntd.unipassau.codeannotation.web.rest.vm.RaterActionVM;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@Tag(name = "Rater Action Resource")
@RestController
public class RaterActionResource {
    private final RaterActionService raterActionService;

    @Autowired
    public RaterActionResource(
            RaterActionService raterActionService) {
        this.raterActionService = raterActionService;
    }

    @Operation(summary = "Create a rater action")
    @PostMapping("/v1/rater-actions")
    @ResponseStatus(HttpStatus.CREATED)
    @Secured({AuthoritiesConstants.RATER})
    public RaterActionVM createRaterAction(@RequestBody @Valid RaterActionVM action) {
        return SecurityUtils.getCurrentUserLogin()
                .map(UUID::fromString)
                .map(raterId -> {
                    action.setRaterId(raterId);
                    return action;
                })
                .flatMap(raterActionService::createRaterAction)
                .orElseThrow(() -> new BadRequestException(
                        "Could not find rater-dataset: " + action.getRaterId() + ", " + action.getDatasetId(),
                        "RaterActionVM", "datasetId"));
    }
}
