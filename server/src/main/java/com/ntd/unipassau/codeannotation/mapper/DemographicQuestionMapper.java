package com.ntd.unipassau.codeannotation.mapper;

import com.ntd.unipassau.codeannotation.domain.question.QuestionGroupAssignment;
import com.ntd.unipassau.codeannotation.domain.question.QuestionSet;
import com.ntd.unipassau.codeannotation.domain.rater.DemographicQuestion;
import com.ntd.unipassau.codeannotation.domain.rater.DemographicQuestionGroup;
import com.ntd.unipassau.codeannotation.web.rest.vm.DemographicQuestionVM;
import com.ntd.unipassau.codeannotation.web.rest.vm.QuestionSetVM;
import org.mapstruct.*;

import java.util.Collection;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface DemographicQuestionMapper {
    @Mapping(target = "questionsPriority", ignore = true)
    @Mapping(target = "questions", ignore = true)
    QuestionSetVM toQuestionSetVM(QuestionSet questionSet);

    @Mapping(target = "datasets", ignore = true)
    @Mapping(target = "questionAssignments", ignore = true)
    @Mapping(target = "lastModifiedDate", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    DemographicQuestionGroup toDQuestionGroup(QuestionSetVM questionSetVM);

    @Named("toSimpleQuestionVM")
    @Mapping(target = "parentId", source = "parentQuestionId")
    @Mapping(target = "questionSetIds", ignore = true)
    @Mapping(target = "groupIds", ignore = true)
    @Mapping(target = "subQuestions", ignore = true)
    DemographicQuestionVM toSimpleQuestionVM(DemographicQuestion question);

    @BeanMapping(qualifiedByName = "afterToDQuestionVM")
    @Mapping(target = "parentId", source = "parentQuestionId")
    @Mapping(target = "questionSetIds", ignore = true)
    @Mapping(target = "groupIds", ignore = true)
    DemographicQuestionVM toQuestionVM(DemographicQuestion question);

    @Mapping(target = "parentQuestionId", ignore = true)
    @Mapping(target = "parentQuestion", ignore = true)
    @Mapping(target = "dtype", ignore = true)
    @Mapping(target = "solutions", ignore = true)
    @Mapping(target = "groupAssignments", ignore = true)
    @Mapping(target = "lastModifiedDate", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    DemographicQuestion toQuestion(DemographicQuestionVM questionVM);

    Collection<DemographicQuestionVM> toQuestionVMs(Collection<DemographicQuestion> questions);

    @AfterMapping
    @Named("afterToDQuestionVM")
    default void afterToDQuestionVM(DemographicQuestion question, @MappingTarget DemographicQuestionVM questionVM) {
        Set<Long> groupIds = question.getGroupAssignments().stream()
                .map(QuestionGroupAssignment::getId)
                .map(QuestionGroupAssignment.Id::getGroupId)
                .collect(Collectors.toSet());
        questionVM.setGroupIds(groupIds);
    }
}
