package com.ntd.unipassau.codeannotation.service;

import com.ntd.unipassau.codeannotation.domain.Rater;
import com.ntd.unipassau.codeannotation.domain.rquestion.RQuestion;
import com.ntd.unipassau.codeannotation.domain.rquestion.RSolution;
import com.ntd.unipassau.codeannotation.mapper.RSolutionMapper;
import com.ntd.unipassau.codeannotation.repository.RQuestionRepository;
import com.ntd.unipassau.codeannotation.repository.RSolutionRepository;
import com.ntd.unipassau.codeannotation.web.rest.vm.RSolutionVM;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RSolutionService {
    private final RSolutionMapper rSolutionMapper;
    private final RSolutionRepository rSolutionRepository;
    private final RQuestionRepository rQuestionRepository;

    @Autowired
    public RSolutionService(
            RSolutionMapper rSolutionMapper,
            RSolutionRepository rSolutionRepository,
            RQuestionRepository rQuestionRepository) {
        this.rSolutionMapper = rSolutionMapper;
        this.rSolutionRepository = rSolutionRepository;
        this.rQuestionRepository = rQuestionRepository;
    }

    @Transactional
    public void createSolutionsInBatch(Rater rater, Collection<RSolutionVM> solutionVMs) {
        // Delete old solution
        rSolutionRepository.deleteByRaterId(rater.getId());

        List<Long> questionIds = solutionVMs.stream()
                .map(RSolutionVM::questionId)
                .toList();
        final Map<Long, RQuestion> rQuestionMap = rQuestionRepository.findAllById(questionIds).stream()
                .collect(Collectors.toMap(RQuestion::getId, rq -> rq));

        Set<RSolution> rSolutions = solutionVMs.stream()
                .map(solutionVM -> {
                    if (!rQuestionMap.containsKey(solutionVM.questionId())) {
                        throw new RuntimeException("Could not find rater-question by id: " + solutionVM.questionId());
                    }
                    RSolution rSolution = rSolutionMapper.toSolution(solutionVM);
                    rSolution.getId().setRaterId(rater.getId());
                    rSolution.setRater(rater);
                    rSolution.setQuestion(rQuestionMap.get(solutionVM.questionId()));
                    return rSolution;
                })
                .collect(Collectors.toSet());

        // Save all in batches
        rSolutionRepository.saveAll(rSolutions);
    }

    public Collection<RSolutionVM> getSolutionsByRater(UUID raterId) {
        Collection<RSolution> solutions = rSolutionRepository.findSolutionsByRater(raterId);
        return rSolutionMapper.toSolutionVMs(solutions);
    }
}
