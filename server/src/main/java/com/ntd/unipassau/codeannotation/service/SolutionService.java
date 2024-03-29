package com.ntd.unipassau.codeannotation.service;

import com.ntd.unipassau.codeannotation.domain.question.Question;
import com.ntd.unipassau.codeannotation.domain.rater.Rater;
import com.ntd.unipassau.codeannotation.domain.rater.Solution;
import com.ntd.unipassau.codeannotation.mapper.SolutionMapper;
import com.ntd.unipassau.codeannotation.repository.DemographicQuestionRepository;
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
    private final DemographicQuestionRepository demographicQuestionRepository;
    private final SnippetQuestionRepository snippetQuestionRepository;

    @Autowired
    public SolutionService(
            SolutionMapper solutionMapper,
            SolutionRepository solutionRepository,
            DemographicQuestionRepository demographicQuestionRepository,
            SnippetQuestionRepository snippetQuestionRepository) {
        this.solutionMapper = solutionMapper;
        this.solutionRepository = solutionRepository;
        this.demographicQuestionRepository = demographicQuestionRepository;
        this.snippetQuestionRepository = snippetQuestionRepository;
    }

    @Transactional
    public void createDemographicSolutionsInBatch(Long datasetId, Rater rater, Collection<SolutionVM> solutionVMs) {
        // Delete old solution
        Collection<Long> demographicQuestions =
                demographicQuestionRepository.findAllFetchGroup(datasetId).stream()
                        .map(Question::getId)
                        .collect(Collectors.toSet());
        solutionRepository.deleteDemographicSolutionsByRaterAndQuestionsId(rater.getId(), demographicQuestions);
        createSolutionsInBatch(rater, solutionVMs, demographicQuestionRepository);
    }

    @Transactional
    public void createSnippetSolutionsInBatch(Long snippetId, Rater rater, Collection<SolutionVM> solutionVMs) {
        // Delete old solution
        solutionRepository.deleteSnippetSolutionsBySnippetId(rater.getId(), snippetId);
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
