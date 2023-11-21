package com.ntd.unipassau.codeannotation.web.rest;

import com.ntd.unipassau.codeannotation.security.AuthoritiesConstants;
import com.ntd.unipassau.codeannotation.service.DQuestionGroupService;
import com.ntd.unipassau.codeannotation.web.rest.errors.NotFoundException;
import com.ntd.unipassau.codeannotation.web.rest.vm.DQuestionGroupParams;
import com.ntd.unipassau.codeannotation.web.rest.vm.QuestionSetVM;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

@Tag(name = "Demographic Question Group Resource")
@RestController
public class DemographicQuestionGroupResource {
    private final DQuestionGroupService dqgService;

    @Autowired
    public DemographicQuestionGroupResource(
            DQuestionGroupService dqgService) {
        this.dqgService = dqgService;
    }

    @Operation(summary = "Create a demographic question group")
    @PostMapping("/v1/demographic-question-groups")
    @ResponseStatus(HttpStatus.CREATED)
    @Secured({AuthoritiesConstants.USER})
    public QuestionSetVM createGroup(@RequestBody @Valid QuestionSetVM groupVM) {
        return dqgService.createGroup(groupVM);
    }

    @Operation(summary = "Update a demographic question group")
    @PutMapping("/v1/demographic-question-groups/{groupId}")
    @Secured({AuthoritiesConstants.USER})
    public QuestionSetVM updateGroup(
            @PathVariable Long groupId,
            @RequestBody @Valid QuestionSetVM groupVM) {
        return dqgService.updateGroup(groupId, groupVM)
                .orElseThrow(() -> new NotFoundException(
                        "Could not find demographic question group by id: " + groupId, "pathVars", "groupId"));
    }

    @Operation(summary = "Delete a demographic question group")
    @DeleteMapping("/v1/demographic-question-groups/{groupId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Secured({AuthoritiesConstants.USER})
    public void deleteGroup(@PathVariable Long groupId) {
        dqgService.deleteById(groupId)
                .orElseThrow(() -> new NotFoundException(
                        "Could not find demographic question group by id: " + groupId, "pathVars", "groupId"));
    }

    @Operation(summary = "Get list of demographic question groups")
    @GetMapping("/v1/demographic-question-groups")
    public Collection<QuestionSetVM> listGroups(DQuestionGroupParams params) {
        return dqgService.listGroups(params);
    }
}
