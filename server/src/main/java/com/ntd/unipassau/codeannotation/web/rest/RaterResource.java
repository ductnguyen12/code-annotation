package com.ntd.unipassau.codeannotation.web.rest;

import com.ntd.unipassau.codeannotation.security.AuthoritiesConstants;
import com.ntd.unipassau.codeannotation.service.RaterService;
import com.ntd.unipassau.codeannotation.web.rest.constraint.RaterConstraint;
import com.ntd.unipassau.codeannotation.web.rest.errors.NotFoundException;
import com.ntd.unipassau.codeannotation.web.rest.vm.RaterVM;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.annotation.Secured;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.UUID;

@Tag(name = "Rater Resource")
@RestController
@Validated
public class RaterResource {
    private final RaterService raterService;

    @Autowired
    public RaterResource(
            RaterService raterService) {
        this.raterService = raterService;
    }

    @Operation(summary = "Register as a rater")
    @PostMapping("/v1/raters/registration")
    public RaterVM registerRater(@RequestBody @Valid @RaterConstraint RaterVM raterVM) {
        return raterService.registerRater(raterVM);
    }

    @Operation(summary = "List all raters")
    @GetMapping("/v1/raters")
    @Secured({AuthoritiesConstants.USER})
    public Collection<RaterVM> listRaters() {
        return raterService.listRaters();
    }

    @Operation(summary = "Get a rater")
    @GetMapping("/v1/raters/{raterId}")
    @Secured({AuthoritiesConstants.USER})
    public RaterVM getRater(@PathVariable UUID raterId) {
        return raterService.getRater(raterId)
                .orElseThrow(() -> new NotFoundException(
                        "Could not find rater by id: " + raterId, "pathVar", "raterId"));
    }

    @Operation(summary = "Delete a rater")
    @DeleteMapping("/v1/raters/{raterId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Secured({AuthoritiesConstants.USER})
    public void deleteRater(@PathVariable UUID raterId) {
        raterService.deleteRater(raterId);
    }

    @Operation(summary = "Get current rater")
    @GetMapping("/v1/raters/me")
    @Secured({AuthoritiesConstants.RATER})
    public RaterVM getCurrentRater() {
        return raterService.getCurrentRaterVM()
                .orElseThrow(() -> new NotFoundException("Unknown rater", "header", "token"));
    }

    @Operation(summary = "Get rater by external information")
    @GetMapping("/v1/raters/{externalSystem}/{externalId}")
    public RaterVM getByExternalInfo(@PathVariable String externalSystem, @PathVariable String externalId) {
        return raterService.getRaterByExternalInfo(externalSystem, externalId)
                .orElseThrow(() -> new NotFoundException("Could not find rater by external info", "Rater", "externalId"));
    }
}
