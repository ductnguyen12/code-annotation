package com.ntd.unipassau.codeannotation.web.rest;

import com.ntd.unipassau.codeannotation.repository.SnippetRepository;
import com.ntd.unipassau.codeannotation.security.AuthoritiesConstants;
import com.ntd.unipassau.codeannotation.service.SnippetQuestionService;
import com.ntd.unipassau.codeannotation.web.rest.constraint.QuestionConstraint;
import com.ntd.unipassau.codeannotation.web.rest.errors.BadRequestException;
import com.ntd.unipassau.codeannotation.web.rest.vm.SnippetQuestionVM;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@Tag(name = "Snippet Question Resource")
@RestController
public class SnippetQuestionResource {
    private final SnippetRepository snippetRepository;
    private final SnippetQuestionService snippetQuestionService;

    @Autowired
    public SnippetQuestionResource(
            SnippetRepository snippetRepository,
            SnippetQuestionService snippetQuestionService) {
        this.snippetRepository = snippetRepository;
        this.snippetQuestionService = snippetQuestionService;
    }

    @Operation(summary = "Create a snippet question")
    @PostMapping("/v1/snippet-questions")
    @ResponseStatus(HttpStatus.CREATED)
    @Secured({AuthoritiesConstants.USER})
    public SnippetQuestionVM createQuestion(
            @RequestBody @Valid @QuestionConstraint SnippetQuestionVM questionVM) {
        Optional.ofNullable(questionVM.getSnippetId())
                .map(snippetRepository::findById)
                .orElseThrow(() -> new BadRequestException(
                        "Could not find snippet ID: " + questionVM.getSnippetId(), "SnippetQuestionVM", "snippetId"));
        return snippetQuestionService.createSnippetQuestion(questionVM);
    }

    @Operation(summary = "Delete a snippet question")
    @DeleteMapping("/v1/snippet-questions/{questionId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Secured({AuthoritiesConstants.USER})
    public void deleteQuestion(@PathVariable Long questionId) {
        snippetQuestionService.deleteSnippetQuestion(questionId)
                .orElseThrow(() -> new BadRequestException(
                        "Could not find snippet question ID: " + questionId, "pathVars", "questionId"));
    }
}
