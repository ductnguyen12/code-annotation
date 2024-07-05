package com.ntd.unipassau.codeannotation.service;

import com.ntd.unipassau.codeannotation.domain.dataset.Snippet;
import com.ntd.unipassau.codeannotation.domain.dataset.SnippetQuestion;
import com.ntd.unipassau.codeannotation.domain.question.Question;
import com.ntd.unipassau.codeannotation.domain.rater.Solution;
import com.ntd.unipassau.codeannotation.mapper.SnippetMapper;
import com.ntd.unipassau.codeannotation.repository.SnippetQuestionRepository;
import com.ntd.unipassau.codeannotation.repository.SnippetRepository;
import com.ntd.unipassau.codeannotation.repository.SolutionRepository;
import com.ntd.unipassau.codeannotation.web.rest.vm.SnippetQuestionPriority;
import com.ntd.unipassau.codeannotation.web.rest.vm.SnippetQuestionVM;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class SnippetQuestionService {
    private final SolutionRepository solutionRepository;
    private final SnippetQuestionRepository snippetQuestionRepository;
    private final SnippetRepository snippetRepository;
    private final SnippetMapper snippetMapper;

    public SnippetQuestionService(
            SolutionRepository solutionRepository,
            SnippetQuestionRepository snippetQuestionRepository,
            SnippetRepository snippetRepository,
            SnippetMapper snippetMapper) {
        this.snippetQuestionRepository = snippetQuestionRepository;
        this.solutionRepository = solutionRepository;
        this.snippetRepository = snippetRepository;
        this.snippetMapper = snippetMapper;
    }

    @Transactional
    public SnippetQuestionVM createSnippetQuestion(SnippetQuestionVM questionVM) {
        Snippet snippet = snippetRepository.findById(questionVM.getSnippetId())
                .orElseThrow(() -> new RuntimeException("Could not find snippet ID: " + questionVM.getSnippetId()));
        SnippetQuestion snippetQuestion = snippetMapper.toSnippetQuestion(questionVM);
        int maxPriority = snippet.getQuestions().stream()
                .mapToInt(q -> q.getPriority() != null ? q.getPriority() : 0)
                .max()
                .orElse(-1);
        snippetQuestion.setPriority(maxPriority + 1);
        snippetQuestion.setSnippet(snippet);
        snippetQuestion = snippetQuestionRepository.save(snippetQuestion);
        return snippetMapper.toSnippetQuestionVM(snippetQuestion);
    }

    @Transactional
    public Collection<SnippetQuestion> createAllInBatch(Collection<SnippetQuestion> questions) {
        snippetQuestionRepository.saveAll(questions);
        return questions;
    }

    @Transactional
    public Optional<SnippetQuestionVM> deleteSnippetQuestion(Long snippetId) {
        return snippetQuestionRepository.findById(snippetId)
                .map(question -> {
                    deleteAllInBatch(Collections.singleton(question));
                    return question;
                })
                .map(snippetMapper::toSnippetQuestionVM);
    }

    @Transactional
    public void deleteAllInBatch(Collection<SnippetQuestion> questions) {
        Set<Solution> solutions = questions.stream().map(Question::getSolutions)
                .filter(Objects::nonNull)
                .flatMap(Set::stream)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
        solutionRepository.deleteAllInBatch(solutions);
        snippetQuestionRepository.deleteAllInBatch(questions);
    }

    @Transactional
    public void updateQuestionPriority(SnippetQuestionPriority questionPriority) {
        List<SnippetQuestion> snippetQuestions = snippetQuestionRepository.findAllById(questionPriority.getQuestionIds());
        snippetQuestions.forEach(q -> questionPriority
                .getPriorityByQuestionId(q.getId())
                .ifPresent(q::setPriority));
        snippetQuestionRepository.saveAll(snippetQuestions);
    }
}
