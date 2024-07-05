package com.ntd.unipassau.codeannotation.web.rest;

import com.ntd.unipassau.codeannotation.service.SnippetQuestionService;
import com.ntd.unipassau.codeannotation.web.rest.vm.SnippetQuestionPriority;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Snippet Question Priority Resource")
@RestController
@Validated
public class SnippetQuestionPriorityResource {
    private final SnippetQuestionService snippetQuestionService;

    @Autowired
    public SnippetQuestionPriorityResource(SnippetQuestionService snippetQuestionService) {
        this.snippetQuestionService = snippetQuestionService;
    }

    @Operation(summary = "Update snippet question priority")
    @PostMapping("/v1/snippet-questions-priorities")
    public void updateQuestionPriorities(
            @RequestBody @Valid SnippetQuestionPriority questionPriority) {
        snippetQuestionService.updateQuestionPriority(questionPriority);
    }
}
