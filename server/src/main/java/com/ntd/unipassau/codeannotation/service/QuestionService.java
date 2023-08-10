package com.ntd.unipassau.codeannotation.service;

import com.ntd.unipassau.codeannotation.domain.Answer;
import com.ntd.unipassau.codeannotation.domain.Question;
import com.ntd.unipassau.codeannotation.repository.AnswerRepository;
import com.ntd.unipassau.codeannotation.repository.QuestionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class QuestionService {
    private final AnswerRepository answerRepository;
    private final QuestionRepository questionRepository;
    private final AnswerService answerService;

    public QuestionService(
            AnswerRepository answerRepository,
            QuestionRepository questionRepository,
            AnswerService answerService) {
        this.answerRepository = answerRepository;
        this.questionRepository = questionRepository;
        this.answerService = answerService;
    }

    @Transactional
    public Collection<Question> createAllInBatch(Collection<Question> questions) {
        Collection<Answer> answers = new LinkedHashSet<>();
        questions.forEach(q -> {
            if (q.getAnswers() != null) {
                answers.addAll(q.getAnswers());
                q.setAnswers(null);
            }
        });
        questionRepository.saveAll(questions);
        answerRepository.saveAll(answers);
        return questions;
    }

    @Transactional
    public void deleteAllInBatch(Collection<Question> questions) {
        Set<Answer> answers = questions.stream()
                .flatMap(q -> q.getAnswers().stream())
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
        answerService.deleteAllInBatch(answers);
        questionRepository.deleteAllInBatch(questions);
    }
}
