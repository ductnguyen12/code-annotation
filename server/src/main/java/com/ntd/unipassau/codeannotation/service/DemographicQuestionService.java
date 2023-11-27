package com.ntd.unipassau.codeannotation.service;

import com.ntd.unipassau.codeannotation.domain.rater.DemographicQuestion;
import com.ntd.unipassau.codeannotation.domain.rater.DemographicQuestionGroup;
import com.ntd.unipassau.codeannotation.mapper.DemographicQuestionMapper;
import com.ntd.unipassau.codeannotation.repository.DemographicQuestionGroupRepository;
import com.ntd.unipassau.codeannotation.repository.DemographicQuestionRepository;
import com.ntd.unipassau.codeannotation.web.rest.vm.DQuestionParams;
import com.ntd.unipassau.codeannotation.web.rest.vm.DemographicQuestionVM;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.Set;

@Service
public class DemographicQuestionService {
    private final DemographicQuestionRepository dQuestionRepository;
    private final DemographicQuestionGroupRepository dqgRepository;
    private final DemographicQuestionMapper dQuestionMapper;

    @Autowired
    public DemographicQuestionService(
            DemographicQuestionRepository dQuestionRepository,
            DemographicQuestionGroupRepository dqgRepository,
            DemographicQuestionMapper dQuestionMapper) {
        this.dQuestionRepository = dQuestionRepository;
        this.dQuestionMapper = dQuestionMapper;
        this.dqgRepository = dqgRepository;
    }

    @Transactional
    public DemographicQuestionVM createDemographicQuestion(DemographicQuestionVM questionVM) {
        DemographicQuestion dQuestion = dQuestionMapper.toQuestion(questionVM);
        return updateDemographicQuestion(dQuestion, questionVM);
    }

    @Transactional
    public DemographicQuestionVM updateDemographicQuestion(Long questionId, DemographicQuestionVM questionVM) {
        DemographicQuestion dQuestion = dQuestionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Could not find rater-question by id: " + questionId));
        BeanUtils.copyProperties(questionVM, dQuestion, "id");
        return updateDemographicQuestion(dQuestion, questionVM);
    }

    @Transactional(readOnly = true)
    public Collection<DemographicQuestionVM> listDemographicQuestions(DQuestionParams params) {
        return dQuestionMapper.toQuestionVMs(dQuestionRepository.findAllFetchGroup(params.getDatasetId()));
    }

    private DemographicQuestionVM updateDemographicQuestion(
            DemographicQuestion rQuestion, DemographicQuestionVM questionVM) {
        if (questionVM.getQuestionSetIds() != null) {
            Set<DemographicQuestionGroup> groups =
                    dqgRepository.findAllFetchQuestionsByIds(questionVM.getQuestionSetIds());
            groups.forEach(group -> group.getQuestions().add(rQuestion));
            rQuestion.setQuestionSets(new LinkedHashSet<>(groups));
        }
        dQuestionRepository.save(rQuestion);
        return dQuestionMapper.toQuestionVM(rQuestion);
    }
}
