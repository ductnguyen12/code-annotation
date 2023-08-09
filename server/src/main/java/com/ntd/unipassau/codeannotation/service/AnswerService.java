package com.ntd.unipassau.codeannotation.service;

import com.ntd.unipassau.codeannotation.domain.Answer;
import com.ntd.unipassau.codeannotation.repository.AnswerRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Service
public class AnswerService {
    private final AnswerRepository answerRepository;

    public AnswerService(AnswerRepository answerRepository) {
        this.answerRepository = answerRepository;
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
