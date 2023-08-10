package com.ntd.unipassau.codeannotation.service;

import com.ntd.unipassau.codeannotation.domain.Answer;
import com.ntd.unipassau.codeannotation.domain.RateAnswer;
import com.ntd.unipassau.codeannotation.repository.AnswerRepository;
import com.ntd.unipassau.codeannotation.repository.RateAnswerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnswerService {
    private final AnswerRepository answerRepository;
    private final RateAnswerRepository rateAnswerRepository;

    public AnswerService(
            AnswerRepository answerRepository,
            RateAnswerRepository rateAnswerRepository) {
        this.answerRepository = answerRepository;
        this.rateAnswerRepository = rateAnswerRepository;
    }

    @Transactional
    public void deleteAllInBatch(Collection<Answer> answers) {
        Set<RateAnswer> rateAnswers = answers.stream()
                .map(Answer::getRateAnswer)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
        rateAnswerRepository.deleteAllInBatch(rateAnswers);
        answerRepository.deleteAllInBatch(answers);
    }

    public Collection<Long> getNonExistedIds(Collection<Long> ids) {
        List<Long> allIds = answerRepository.findAllById(ids)
                .stream()
                .map(Answer::getId)
                .toList();
        ArrayList<Long> nonExistedIds = new ArrayList<>(ids);
        nonExistedIds.removeAll(allIds);
        return nonExistedIds;
    }
}
