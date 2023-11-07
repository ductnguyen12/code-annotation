package com.ntd.unipassau.codeannotation.web.rest;

import com.ntd.unipassau.codeannotation.domain.dataset.Dataset;
import com.ntd.unipassau.codeannotation.domain.dataset.Snippet;
import com.ntd.unipassau.codeannotation.domain.question.Question;
import com.ntd.unipassau.codeannotation.mapper.SnippetMapper;
import com.ntd.unipassau.codeannotation.security.AuthoritiesConstants;
import com.ntd.unipassau.codeannotation.service.DatasetService;
import com.ntd.unipassau.codeannotation.service.SnippetService;
import com.ntd.unipassau.codeannotation.web.rest.errors.BadRequestException;
import com.ntd.unipassau.codeannotation.web.rest.errors.NotFoundException;
import com.ntd.unipassau.codeannotation.web.rest.vm.SnippetRateVM;
import com.ntd.unipassau.codeannotation.web.rest.vm.SnippetVM;
import com.ntd.unipassau.codeannotation.web.rest.vm.SolutionVM;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.annotation.Secured;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Tag(name = "Snippet Resource")
@RestController
@Validated
public class SnippetResource {
    private final DatasetService datasetService;
    private final SnippetService snippetService;
    private final SnippetMapper snippetMapper;

    @Autowired
    public SnippetResource(
            DatasetService datasetService,
            SnippetService snippetService,
            SnippetMapper snippetMapper) {
        this.datasetService = datasetService;
        this.snippetService = snippetService;
        this.snippetMapper = snippetMapper;
    }

    @Operation(summary = "Get dataset snippets")
    @GetMapping("/v1/datasets/{datasetId}/snippets")
    @Secured({AuthoritiesConstants.RATER, AuthoritiesConstants.USER})
    public Collection<SnippetVM> getDatasetSnippets(@PathVariable Long datasetId) {
        return snippetService.getDatasetSnippets(datasetId);
    }

    @Operation(summary = "Create a snippet")
    @PostMapping("/v1/snippets")
    @ResponseStatus(HttpStatus.CREATED)
    public SnippetVM createSnippet(@RequestBody @Valid SnippetVM snippetVM) {
        Dataset dataset = datasetService.getById(snippetVM.getDatasetId())
                .orElseThrow(() -> new BadRequestException(
                        "Could not find dataset by id: " + snippetVM.getDatasetId(), "snippet", "datasetId"));
        Snippet snippet = snippetMapper.toSnippet(snippetVM);
        snippet.setDataset(dataset);
        return snippetMapper.toSnippetVM(snippetService.createSnippet(snippet));
    }

    @Operation(summary = "Delete a snippet")
    @DeleteMapping("/v1/snippets/{snippetId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Secured({AuthoritiesConstants.USER})
    public void deleteSnippet(@PathVariable Long snippetId) {
        snippetService.getById(snippetId)
                .orElseThrow(() -> new NotFoundException(
                        "Could not find snippet by id: " + snippetId, "pathVars", "snippetId"));
        snippetService.deleteById(snippetId);
    }

    @Operation(summary = "Rate a snippet")
    @PostMapping("/v1/snippets/{snippetId}/rates")
    @ResponseStatus(HttpStatus.CREATED)
    @Secured({AuthoritiesConstants.RATER})
    public void createSnippetRate(@PathVariable Long snippetId, @RequestBody @Valid SnippetRateVM rate) {
        Snippet snippet = snippetService.getById(snippetId)
                .orElseThrow(() -> new NotFoundException(
                        "Could not find snippet by id: " + snippetId, "pathVars", "snippetId"));
        validateSnippetSolutions(snippet, rate.getSolutions());
        snippetService.rateSnippet(rate, snippet);
    }

    private void validateSnippetSolutions(Snippet snippet, Collection<SolutionVM> solutions) {
        Set<Long> snippetQuestions = snippet.getQuestions().stream().map(Question::getId).collect(Collectors.toSet());
        Set<Long> solutionQuestions = solutions.stream()
                .map(SolutionVM::questionId)
                .collect(Collectors.toSet());
        if (!snippetQuestions.containsAll(solutionQuestions)) {
            List<Long> unknownQuestions = solutionQuestions.stream()
                    .filter(qid -> !snippetQuestions.contains(qid))
                    .toList();
            throw new BadRequestException(
                    "Question ID " + StringUtils.join(unknownQuestions, ", ")
                            + " do not belong to snippet: " + snippet.getId(),
                    "rate", "solutions");
        } else if (!solutionQuestions.containsAll(snippetQuestions)) {
            List<Long> answeredQuestions = snippetQuestions.stream()
                    .filter(qid -> !solutionQuestions.contains(qid))
                    .toList();
            throw new BadRequestException(
                    "Question ID " + StringUtils.join(answeredQuestions, ", ") + " have not been answered ",
                    "rate", "solutions");
        }
    }
}
