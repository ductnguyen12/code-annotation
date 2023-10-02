package com.ntd.unipassau.codeannotation.service;

import com.ntd.unipassau.codeannotation.domain.rquestion.RQuestion;
import com.ntd.unipassau.codeannotation.domain.rquestion.RQuestionSet;
import com.ntd.unipassau.codeannotation.mapper.RQuestionMapper;
import com.ntd.unipassau.codeannotation.repository.RQuestionRepository;
import com.ntd.unipassau.codeannotation.repository.RQuestionSetRepository;
import com.ntd.unipassau.codeannotation.web.rest.vm.RQuestionVM;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;

@Service
public class RQuestionService {
    private final RQuestionRepository rQuestionRepository;
    private final RQuestionSetRepository rQuestionSetRepository;
    private final RQuestionMapper rQuestionMapper;

    @Autowired
    public RQuestionService(
            RQuestionRepository rQuestionRepository,
            RQuestionSetRepository rQuestionSetRepository,
            RQuestionMapper rQuestionMapper) {
        this.rQuestionRepository = rQuestionRepository;
        this.rQuestionMapper = rQuestionMapper;
        this.rQuestionSetRepository = rQuestionSetRepository;
    }

    @Transactional
    public RQuestionVM createRQuestion(RQuestionVM questionVM) {
        RQuestion rQuestion = rQuestionMapper.toQuestion(questionVM);
        if (questionVM.questionSetId() != null) {
            RQuestionSet rQuestionSet = rQuestionSetRepository.findById(questionVM.questionSetId())
                    .orElseThrow(() -> new RuntimeException(
                            "Could not find question-set by id: " + questionVM.questionSetId()));
            rQuestion.setQuestionSet(rQuestionSet);
        }
        rQuestionRepository.save(rQuestion);
        return rQuestionMapper.toQuestionVM(rQuestion);
    }

    @Transactional
    public RQuestionVM updateRQuestion(Long questionId, RQuestionVM questionVM) {
        RQuestion rQuestion = rQuestionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Could not find rater-question by id: " + questionId));
        BeanUtils.copyProperties(questionVM, rQuestion, "id");
        if (questionVM.questionSetId() != null) {
            RQuestionSet rQuestionSet = rQuestionSetRepository.findById(questionVM.questionSetId())
                    .orElseThrow(() -> new RuntimeException(
                            "Could not find question-set by id: " + questionVM.questionSetId()));
            rQuestion.setQuestionSet(rQuestionSet);
        }
        rQuestionRepository.save(rQuestion);
        return rQuestionMapper.toQuestionVM(rQuestion);
    }

    public Collection<RQuestionVM> listRQuestions() {
        return rQuestionMapper.toQuestionVMs(rQuestionRepository.findAll());
    }
}
