package com.ntd.unipassau.codeannotation.service;

import com.ntd.unipassau.codeannotation.domain.rater.DemographicQuestionGroup;
import com.ntd.unipassau.codeannotation.mapper.DemographicQuestionMapper;
import com.ntd.unipassau.codeannotation.repository.DemographicQuestionGroupRepository;
import com.ntd.unipassau.codeannotation.web.rest.vm.DQuestionGroupParams;
import com.ntd.unipassau.codeannotation.web.rest.vm.QuestionSetVM;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.Optional;

@Service
public class DQuestionGroupService {

    private final DemographicQuestionGroupRepository dqgRepository;
    private final DemographicQuestionMapper dqMapper;

    @Autowired
    public DQuestionGroupService(
            DemographicQuestionGroupRepository dqgRepository,
            DemographicQuestionMapper dqMapper) {
        this.dqgRepository = dqgRepository;
        this.dqMapper = dqMapper;
    }

    @PostConstruct
    public void init() {
        Collection<DemographicQuestionGroup> allFetchQuestions = dqgRepository.findAllFetchQuestions(1L);
        System.out.println(allFetchQuestions);
    }

    @Transactional
    public QuestionSetVM createGroup(QuestionSetVM groupVM) {
        DemographicQuestionGroup group = dqMapper.toDQuestionGroup(groupVM);
        return dqMapper.toQuestionSetVM(dqgRepository.save(group));
    }

    @Transactional(readOnly = true)
    public Collection<QuestionSetVM> listGroups(DQuestionGroupParams params) {
        Collection<DemographicQuestionGroup> groups = dqgRepository.findAllFetchQuestions(params.getDatasetId());
        return dqMapper.toDQuestionGroupVMs(groups);
    }

    @Transactional
    public Optional<QuestionSetVM> updateGroup(Long groupId, QuestionSetVM groupVM) {
        return dqgRepository.findById(groupId)
                .map(group -> {
                    BeanUtils.copyProperties(groupVM, group, "id");
                    return dqgRepository.save(group);
                })
                .map(dqMapper::toQuestionSetVM);
    }

    @Transactional
    public Optional<QuestionSetVM> deleteById(Long id) {
        return dqgRepository.findById(id)
                .map(group -> {
                    dqgRepository.delete(group);
                    return group;
                })
                .map(dqMapper::toQuestionSetVM);
    }
}
