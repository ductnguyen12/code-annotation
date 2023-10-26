package com.ntd.unipassau.codeannotation.service;

import com.ntd.unipassau.codeannotation.domain.question.QuestionSet;
import com.ntd.unipassau.codeannotation.domain.rater.DemographicQuestion;
import com.ntd.unipassau.codeannotation.mapper.DemographicQuestionMapper;
import com.ntd.unipassau.codeannotation.repository.QuestionSetRepository;
import com.ntd.unipassau.codeannotation.repository.DemographicQuestionRepository;
import com.ntd.unipassau.codeannotation.web.rest.vm.DemographicQuestionVM;
import com.ntd.unipassau.codeannotation.web.rest.vm.QuestionVM;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;

@Service
public class DemographicQuestionService {
    private final DemographicQuestionRepository rQuestionRepository;
    private final QuestionSetRepository questionSetRepository;
    private final DemographicQuestionMapper rQuestionMapper;

    @Autowired
    public DemographicQuestionService(
            DemographicQuestionRepository rQuestionRepository,
            QuestionSetRepository rQuestionSetRepository,
            DemographicQuestionMapper rQuestionMapper) {
        this.rQuestionRepository = rQuestionRepository;
        this.rQuestionMapper = rQuestionMapper;
        this.questionSetRepository = rQuestionSetRepository;
    }

    @Transactional
    public DemographicQuestionVM createDemographicQuestion(QuestionVM questionVM) {
        DemographicQuestion rQuestion = rQuestionMapper.toQuestion(questionVM);
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
    public DemographicQuestionVM updateDemographicQuestion(Long questionId, QuestionVM questionVM) {
        DemographicQuestion rQuestion = rQuestionRepository.findById(questionId)
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

    public Collection<DemographicQuestionVM> listDemographicQuestions() {
        return rQuestionMapper.toQuestionVMs(rQuestionRepository.findAllFetchQuestionSet());
    }
}
