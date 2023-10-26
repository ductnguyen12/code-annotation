package com.ntd.unipassau.codeannotation.web.rest;

import com.ntd.unipassau.codeannotation.repository.DemographicQuestionRepository;
import com.ntd.unipassau.codeannotation.security.AuthoritiesConstants;
import com.ntd.unipassau.codeannotation.service.DemographicQuestionService;
import com.ntd.unipassau.codeannotation.web.rest.constraint.QuestionConstraint;
import com.ntd.unipassau.codeannotation.web.rest.errors.NotFoundException;
import com.ntd.unipassau.codeannotation.web.rest.vm.DemographicQuestionVM;
import com.ntd.unipassau.codeannotation.web.rest.vm.QuestionVM;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

@Tag(name = "Demographic Question Resource")
@RestController
public class DemographicQuestionResource {
    private final DemographicQuestionRepository demographicQuestionRepository;
    private final DemographicQuestionService demographicQuestionService;

    @Autowired
    public DemographicQuestionResource(
            DemographicQuestionRepository rQuestionRepository,
            DemographicQuestionService rQuestionService) {
        this.demographicQuestionRepository = rQuestionRepository;
        this.demographicQuestionService = rQuestionService;
    }

    @Operation(summary = "Create a question for new raters")
    @PostMapping("/v1/demographic-questions")
    @ResponseStatus(HttpStatus.CREATED)
    @Secured({AuthoritiesConstants.USER})
    public DemographicQuestionVM createQuestion(@RequestBody @Valid @QuestionConstraint QuestionVM questionVM) {
        return demographicQuestionService.createDemographicQuestion(questionVM);
    }

    @Operation(summary = "Update a question for new raters")
    @PutMapping("/v1/demographic-questions/{questionId}")
    @Secured({AuthoritiesConstants.USER})
    public DemographicQuestionVM updateQuestion(
            @PathVariable Long questionId,
            @RequestBody @Valid @QuestionConstraint QuestionVM questionVM) {
        demographicQuestionRepository.findById(questionId)
                .orElseThrow(() -> new NotFoundException(
                        "Could not find rater-question by id: " + questionId, "pathVars", "questionId"));
        return demographicQuestionService.updateDemographicQuestion(questionId, questionVM);
    }

    @Operation(summary = "Delete a question for new raters")
    @DeleteMapping("/v1/demographic-questions/{questionId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Secured({AuthoritiesConstants.USER})
    public void deleteQuestion(@PathVariable Long questionId) {
        demographicQuestionRepository.deleteById(questionId);
    }

    @Operation(summary = "Get list of questions for new raters")
    @GetMapping("/v1/demographic-questions")
    public Collection<DemographicQuestionVM> listQuestions() {
        return demographicQuestionService.listDemographicQuestions();
    }
}
