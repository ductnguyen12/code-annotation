package com.ntd.unipassau.codeannotation.web.rest;

import com.ntd.unipassau.codeannotation.repository.RQuestionRepository;
import com.ntd.unipassau.codeannotation.security.AuthoritiesConstants;
import com.ntd.unipassau.codeannotation.service.RQuestionService;
import com.ntd.unipassau.codeannotation.web.rest.constraint.RQuestionConstraint;
import com.ntd.unipassau.codeannotation.web.rest.errors.NotFoundException;
import com.ntd.unipassau.codeannotation.web.rest.vm.RQuestionVM;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

@Tag(name = "Rater Question Resource")
@RestController
public class RQuestionResource {
    private final RQuestionRepository rQuestionRepository;
    private final RQuestionService rQuestionService;

    @Autowired
    public RQuestionResource(
            RQuestionRepository rQuestionRepository,
            RQuestionService rQuestionService) {
        this.rQuestionRepository = rQuestionRepository;
        this.rQuestionService = rQuestionService;
    }

    @Operation(summary = "Create a question for new raters")
    @PostMapping("/v1/rquestions")
    @ResponseStatus(HttpStatus.CREATED)
    @Secured({AuthoritiesConstants.USER})
    public RQuestionVM createQuestion(@RequestBody @Valid @RQuestionConstraint RQuestionVM questionVM) {
        return rQuestionService.createRQuestion(questionVM);
    }

    @Operation(summary = "Update a question for new raters")
    @PutMapping("/v1/rquestions/{questionId}")
    @Secured({AuthoritiesConstants.USER})
    public RQuestionVM updateQuestion(
            @PathVariable Long questionId,
            @RequestBody @Valid @RQuestionConstraint RQuestionVM questionVM) {
        rQuestionRepository.findById(questionId)
                .orElseThrow(() -> new NotFoundException(
                        "Could not find rater-question by id: " + questionId, "pathVars", "questionId"));
        return rQuestionService.updateRQuestion(questionId, questionVM);
    }

    @Operation(summary = "Delete a question for new raters")
    @DeleteMapping("/v1/rquestions/{questionId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Secured({AuthoritiesConstants.USER})
    public void deleteQuestion(@PathVariable Long questionId) {
        rQuestionRepository.deleteById(questionId);
    }

    @Operation(summary = "Get list of questions for new raters")
    @GetMapping("/v1/rquestions")
    @Secured({AuthoritiesConstants.USER})
    public Collection<RQuestionVM> listQuestions() {
        return rQuestionService.listRQuestions();
    }
}
