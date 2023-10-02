package com.ntd.unipassau.codeannotation.web.rest;

import com.ntd.unipassau.codeannotation.domain.rquestion.RQuestionSet;
import com.ntd.unipassau.codeannotation.mapper.RQuestionMapper;
import com.ntd.unipassau.codeannotation.repository.RQuestionSetRepository;
import com.ntd.unipassau.codeannotation.security.AuthoritiesConstants;
import com.ntd.unipassau.codeannotation.web.rest.errors.NotFoundException;
import com.ntd.unipassau.codeannotation.web.rest.vm.RQuestionSetVM;
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
public class RQuestionSetResource {
    private final RQuestionSetRepository rQuestionSetRepository;
    private final RQuestionMapper rQuestionMapper;

    @Autowired
    public RQuestionSetResource(
            RQuestionSetRepository rQuestionSetRepository,
            RQuestionMapper rQuestionMapper) {
        this.rQuestionSetRepository = rQuestionSetRepository;
        this.rQuestionMapper = rQuestionMapper;
    }

    @Operation(summary = "Create a question set for new raters")
    @PostMapping("/v1/rquestion-sets")
    @ResponseStatus(HttpStatus.CREATED)
    @Secured({AuthoritiesConstants.USER})
    public RQuestionSetVM createQuestionSet(@RequestBody @Valid RQuestionSetVM questionSetVM) {
        RQuestionSet questionSet = rQuestionSetRepository.save(rQuestionMapper.toQuestionSet(questionSetVM));
        return rQuestionMapper.toQuestionSetVM(questionSet);
    }

    @Operation(summary = "Update a question set for new raters")
    @PutMapping("/v1/rquestion-sets/{questionSetId}")
    @Secured({AuthoritiesConstants.USER})
    public RQuestionSetVM updateQuestionSet(
            @PathVariable Long questionSetId,
            @RequestBody @Valid RQuestionSetVM questionSetVM) {
        RQuestionSet questionSet = rQuestionSetRepository.findById(questionSetId)
                .orElseThrow(() -> new NotFoundException(
                        "Could not find rater-question-set by id: " + questionSetId, "pathVars", "questionSetId"));
        BeanUtils.copyProperties(questionSetVM, questionSet, "id");
        rQuestionSetRepository.save(questionSet);
        return rQuestionMapper.toQuestionSetVM(questionSet);
    }

    @Operation(summary = "Delete a question set for new raters")
    @DeleteMapping("/v1/rquestion-sets/{questionSetId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Secured({AuthoritiesConstants.USER})
    public void deleteQuestionSet(@PathVariable Long questionSetId) {
        rQuestionSetRepository.deleteById(questionSetId);
    }

    @Operation(summary = "Get list of question sets for new raters")
    @GetMapping("/v1/rquestion-sets")
    @Secured({AuthoritiesConstants.USER})
    public Collection<RQuestionSetVM> listQuestionSets() {
        return rQuestionMapper.toQuestionSetVMs(rQuestionSetRepository.findAllFetchQuestions());
    }
}
