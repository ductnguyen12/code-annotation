package com.ntd.unipassau.codeannotation.service;

import com.ntd.unipassau.codeannotation.domain.question.Question;
import com.ntd.unipassau.codeannotation.domain.rater.Rater;
import com.ntd.unipassau.codeannotation.domain.rater.Solution;
import com.ntd.unipassau.codeannotation.mapper.SolutionMapper;
import com.ntd.unipassau.codeannotation.repository.RaterQuestionRepository;
import com.ntd.unipassau.codeannotation.repository.RaterRepository;
import com.ntd.unipassau.codeannotation.repository.SnippetQuestionRepository;
import com.ntd.unipassau.codeannotation.repository.SolutionRepository;
import com.ntd.unipassau.codeannotation.web.rest.vm.SolutionVM;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class SolutionService {
    private final SolutionMapper solutionMapper;
    private final SolutionRepository solutionRepository;
    private final RaterQuestionRepository rQuestionRepository;
    private final SnippetQuestionRepository snippetQuestionRepository;

    @Autowired
    public SolutionService(
            SolutionMapper solutionMapper,
            SolutionRepository solutionRepository,
            RaterQuestionRepository rQuestionRepository,
            SnippetQuestionRepository snippetQuestionRepository,
            RaterRepository raterRepository) {
        this.solutionMapper = solutionMapper;
        this.solutionRepository = solutionRepository;
        this.rQuestionRepository = rQuestionRepository;
        this.snippetQuestionRepository = snippetQuestionRepository;
    }

    @Transactional
    public void createRaterSolutionsInBatch(Rater rater, Collection<SolutionVM> solutionVMs) {
        // Delete old solution
        solutionRepository.deleteRaterSolutionsByRaterId(rater.getId());
        createSolutionsInBatch(rater, solutionVMs, rQuestionRepository);
    }

    @Transactional
    public void createSnippetSolutionsInBatch(Long snippetId, Rater rater, Collection<SolutionVM> solutionVMs) {
        // Delete old solution
        solutionRepository.deleteSnippetSolutionsBySnippetId(snippetId);
        createSolutionsInBatch(rater, solutionVMs, snippetQuestionRepository);
    }

    public Collection<SolutionVM> getSolutionsByRater(UUID raterId) {
        Collection<Solution> solutions = solutionRepository.findSolutionsByRater(raterId);
        return solutionMapper.toSolutionVMs(solutions);
    }

    private <T extends Question> void createSolutionsInBatch(
            Rater rater, Collection<SolutionVM> solutionVMs, JpaRepository<T, Long> repository) {

        List<Long> questionIds = solutionVMs.stream()
                .map(SolutionVM::questionId)
                .toList();
        final Map<Long, T> questionMap = repository.findAllById(questionIds).stream()
                .collect(Collectors.toMap(Question::getId, sq -> sq));

        Set<Solution> solutions = solutionVMs.stream()
                .map(solutionVM -> {
                    if (!questionMap.containsKey(solutionVM.questionId())) {
                        throw new RuntimeException("Could not find question by id: " + solutionVM.questionId());
                    }
                    Solution solution = solutionMapper.toSolution(solutionVM);
                    solution.getId().setRaterId(rater.getId());
                    solution.setRater(rater);
                    solution.setQuestion(questionMap.get(solutionVM.questionId()));
                    return solution;
                })
                .collect(Collectors.toSet());

        // Save all in batches
        solutionRepository.saveAll(solutions);
    }
}
