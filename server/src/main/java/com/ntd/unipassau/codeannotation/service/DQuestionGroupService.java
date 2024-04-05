package com.ntd.unipassau.codeannotation.service;

import com.ntd.unipassau.codeannotation.domain.question.QuestionGroupAssignment;
import com.ntd.unipassau.codeannotation.domain.rater.DemographicQuestion;
import com.ntd.unipassau.codeannotation.domain.rater.DemographicQuestionGroup;
import com.ntd.unipassau.codeannotation.mapper.DemographicQuestionMapper;
import com.ntd.unipassau.codeannotation.repository.DemographicQuestionGroupRepository;
import com.ntd.unipassau.codeannotation.web.rest.vm.DQuestionGroupParams;
import com.ntd.unipassau.codeannotation.web.rest.vm.DemographicQuestionVM;
import com.ntd.unipassau.codeannotation.web.rest.vm.QuestionSetVM;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

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

    @Transactional
    public QuestionSetVM createGroup(QuestionSetVM groupVM) {
        DemographicQuestionGroup group = dqMapper.toDQuestionGroup(groupVM);
        return dqMapper.toQuestionSetVM(dqgRepository.save(group));
    }

    @Transactional(readOnly = true)
    public Collection<QuestionSetVM> listGroups(DQuestionGroupParams params) {
        Collection<DemographicQuestionGroup> groups = dqgRepository.findAllFetchQuestions(params.getDatasetId());
        return groups.stream()
                .map(group -> {
                    QuestionSetVM groupVM = dqMapper.toQuestionSetVM(group);
                    List<DemographicQuestionVM> questionVMs = group.getQuestionAssignments().stream()
                            .sorted(Comparator.comparingInt(
                                    assignment -> Optional.ofNullable(assignment.getPriority())
                                            .orElse(Integer.MAX_VALUE))
                            )
                            .map(QuestionGroupAssignment::getQuestion)
                            .map(DemographicQuestion.class::cast)
                            .map(dqMapper::toSimpleQuestionVM)
                            .toList();
                    groupVM.setQuestions(questionVMs);
                    return groupVM;
                })
                .toList();
    }

    @Transactional
    public Optional<QuestionSetVM> updateGroup(Long groupId, QuestionSetVM groupVM) {
        return dqgRepository.findById(groupId)
                .map(group -> {
                    BeanUtils.copyProperties(groupVM, group, "id");
                    if (groupVM.getQuestionsPriority() != null) {
                        Map<Long, Integer> priorityMap = groupVM.getQuestionsPriority();
                        group.getQuestionAssignments().forEach(assignment -> {
                            assignment.setPriority(
                                    priorityMap.getOrDefault(
                                            assignment.getId().getQuestionId(), null));
                        });
                    }
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
