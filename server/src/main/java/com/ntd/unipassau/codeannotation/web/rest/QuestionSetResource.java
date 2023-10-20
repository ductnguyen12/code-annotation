package com.ntd.unipassau.codeannotation.web.rest;

import com.ntd.unipassau.codeannotation.domain.question.QuestionSet;
import com.ntd.unipassau.codeannotation.mapper.RaterQuestionMapper;
import com.ntd.unipassau.codeannotation.repository.QuestionSetRepository;
import com.ntd.unipassau.codeannotation.security.AuthoritiesConstants;
import com.ntd.unipassau.codeannotation.web.rest.errors.NotFoundException;
import com.ntd.unipassau.codeannotation.web.rest.vm.QuestionSetVM;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

@Tag(name = "Rater Question Set Resource")
@RestController
public class QuestionSetResource {
    private final QuestionSetRepository questionSetRepository;
    private final RaterQuestionMapper rQuestionMapper;

    @Autowired
    public QuestionSetResource(
            QuestionSetRepository questionSetRepository,
            RaterQuestionMapper rQuestionMapper) {
        this.questionSetRepository = questionSetRepository;
        this.rQuestionMapper = rQuestionMapper;
    }

    @Operation(summary = "Create a question set")
    @PostMapping("/v1/question-sets")
    @ResponseStatus(HttpStatus.CREATED)
    @Secured({AuthoritiesConstants.USER})
    public QuestionSetVM createQuestionSet(@RequestBody @Valid QuestionSetVM questionSetVM) {
        QuestionSet questionSet = questionSetRepository.save(rQuestionMapper.toQuestionSet(questionSetVM));
        return rQuestionMapper.toQuestionSetVM(questionSet);
    }

    @Operation(summary = "Update a question set")
    @PutMapping("/v1/question-sets/{questionSetId}")
    @Secured({AuthoritiesConstants.USER})
    public QuestionSetVM updateQuestionSet(
            @PathVariable Long questionSetId,
            @RequestBody @Valid QuestionSetVM questionSetVM) {
        QuestionSet questionSet = questionSetRepository.findById(questionSetId)
                .orElseThrow(() -> new NotFoundException(
                        "Could not find rater-question-set by id: " + questionSetId, "pathVars", "questionSetId"));
        BeanUtils.copyProperties(questionSetVM, questionSet, "id");
        questionSetRepository.save(questionSet);
        return rQuestionMapper.toQuestionSetVM(questionSet);
    }

    @Operation(summary = "Delete a question set")
    @DeleteMapping("/v1/question-sets/{questionSetId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Secured({AuthoritiesConstants.USER})
    public void deleteQuestionSet(@PathVariable Long questionSetId) {
        questionSetRepository.deleteById(questionSetId);
    }

    @Operation(summary = "Get list of question sets")
    @GetMapping("/v1/question-sets")
    public Collection<QuestionSetVM> listQuestionSets() {
        return rQuestionMapper.toQuestionSetVMs(questionSetRepository.findAllFetchQuestions());
    }
}
