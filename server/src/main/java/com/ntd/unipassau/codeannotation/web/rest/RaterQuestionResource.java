package com.ntd.unipassau.codeannotation.web.rest;

import com.ntd.unipassau.codeannotation.repository.RaterQuestionRepository;
import com.ntd.unipassau.codeannotation.security.AuthoritiesConstants;
import com.ntd.unipassau.codeannotation.service.RaterQuestionService;
import com.ntd.unipassau.codeannotation.web.rest.constraint.QuestionConstraint;
import com.ntd.unipassau.codeannotation.web.rest.errors.NotFoundException;
import com.ntd.unipassau.codeannotation.web.rest.vm.QuestionVM;
import com.ntd.unipassau.codeannotation.web.rest.vm.RaterQuestionVM;
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
public class RaterQuestionResource {
    private final RaterQuestionRepository raterQuestionRepository;
    private final RaterQuestionService raterQuestionService;

    @Autowired
    public RaterQuestionResource(
            RaterQuestionRepository rQuestionRepository,
            RaterQuestionService rQuestionService) {
        this.raterQuestionRepository = rQuestionRepository;
        this.raterQuestionService = rQuestionService;
    }

    @Operation(summary = "Create a question for new raters")
    @PostMapping("/v1/rater-questions")
    @ResponseStatus(HttpStatus.CREATED)
    @Secured({AuthoritiesConstants.USER})
    public RaterQuestionVM createQuestion(@RequestBody @Valid @QuestionConstraint QuestionVM questionVM) {
        return raterQuestionService.createRaterQuestion(questionVM);
    }

    @Operation(summary = "Update a question for new raters")
    @PutMapping("/v1/rater-questions/{questionId}")
    @Secured({AuthoritiesConstants.USER})
    public RaterQuestionVM updateQuestion(
            @PathVariable Long questionId,
            @RequestBody @Valid @QuestionConstraint QuestionVM questionVM) {
        raterQuestionRepository.findById(questionId)
                .orElseThrow(() -> new NotFoundException(
                        "Could not find rater-question by id: " + questionId, "pathVars", "questionId"));
        return raterQuestionService.updateRaterQuestion(questionId, questionVM);
    }

    @Operation(summary = "Delete a question for new raters")
    @DeleteMapping("/v1/rater-questions/{questionId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Secured({AuthoritiesConstants.USER})
    public void deleteQuestion(@PathVariable Long questionId) {
        raterQuestionRepository.deleteById(questionId);
    }

    @Operation(summary = "Get list of questions for new raters")
    @GetMapping("/v1/rater-questions")
    @Secured({AuthoritiesConstants.USER})
    public Collection<RaterQuestionVM> listQuestions() {
        return raterQuestionService.listRaterQuestions();
    }
}
