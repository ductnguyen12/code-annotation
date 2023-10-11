package com.ntd.unipassau.codeannotation.service;

import com.ntd.unipassau.codeannotation.domain.question.QuestionSet;
import com.ntd.unipassau.codeannotation.domain.rater.RaterQuestion;
import com.ntd.unipassau.codeannotation.mapper.RaterQuestionMapper;
import com.ntd.unipassau.codeannotation.repository.QuestionSetRepository;
import com.ntd.unipassau.codeannotation.repository.RaterQuestionRepository;
import com.ntd.unipassau.codeannotation.web.rest.vm.QuestionVM;
import com.ntd.unipassau.codeannotation.web.rest.vm.RaterQuestionVM;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;

@Service
public class RaterQuestionService {
    private final RaterQuestionRepository rQuestionRepository;
    private final QuestionSetRepository questionSetRepository;
    private final RaterQuestionMapper rQuestionMapper;

    @Autowired
    public RaterQuestionService(
            RaterQuestionRepository rQuestionRepository,
            QuestionSetRepository rQuestionSetRepository,
            RaterQuestionMapper rQuestionMapper) {
        this.rQuestionRepository = rQuestionRepository;
        this.rQuestionMapper = rQuestionMapper;
        this.questionSetRepository = rQuestionSetRepository;
    }

    @Transactional
    public RaterQuestionVM createRaterQuestion(QuestionVM questionVM) {
        RaterQuestion rQuestion = rQuestionMapper.toQuestion(questionVM);
        if (questionVM.getQuestionSetId() != null) {
            QuestionSet questionSet = questionSetRepository.findById(questionVM.getQuestionSetId())
                    .orElseThrow(() -> new RuntimeException(
                            "Could not find question-set by id: " + questionVM.getQuestionSetId()));
            rQuestion.setQuestionSet(questionSet);
        }
        rQuestionRepository.save(rQuestion);
        return rQuestionMapper.toQuestionVM(rQuestion);
    }

    @Transactional
    public RaterQuestionVM updateRaterQuestion(Long questionId, QuestionVM questionVM) {
        RaterQuestion rQuestion = rQuestionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Could not find rater-question by id: " + questionId));
        BeanUtils.copyProperties(questionVM, rQuestion, "id");
        if (questionVM.getQuestionSetId() != null) {
            QuestionSet rQuestionSet = questionSetRepository.findById(questionVM.getQuestionSetId())
                    .orElseThrow(() -> new RuntimeException(
                            "Could not find question-set by id: " + questionVM.getQuestionSetId()));
            rQuestion.setQuestionSet(rQuestionSet);
        }
        rQuestionRepository.save(rQuestion);
        return rQuestionMapper.toQuestionVM(rQuestion);
    }

    public Collection<RaterQuestionVM> listRaterQuestions() {
        return rQuestionMapper.toQuestionVMs(rQuestionRepository.findAll());
    }
}
