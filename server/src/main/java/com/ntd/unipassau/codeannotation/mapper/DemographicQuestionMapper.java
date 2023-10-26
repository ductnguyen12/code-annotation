package com.ntd.unipassau.codeannotation.mapper;

import com.ntd.unipassau.codeannotation.domain.question.QuestionSet;
import com.ntd.unipassau.codeannotation.domain.rater.DemographicQuestion;
import com.ntd.unipassau.codeannotation.web.rest.vm.DemographicQuestionVM;
import com.ntd.unipassau.codeannotation.web.rest.vm.QuestionSetVM;
import com.ntd.unipassau.codeannotation.web.rest.vm.QuestionVM;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.Collection;

@Mapper(componentModel = "spring")
public interface DemographicQuestionMapper {
    QuestionSetVM toQuestionSetVM(QuestionSet questionSet);

    @Mapping(target = "questions", ignore = true)
    @Mapping(target = "lastModifiedDate", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    QuestionSet toQuestionSet(QuestionSetVM questionSetVM);

    Collection<QuestionSetVM> toQuestionSetVMs(Collection<QuestionSet> questionSets);

    @Mapping(target = "questionSetId", source = "questionSet.id")
    DemographicQuestionVM toQuestionVM(DemographicQuestion question);

    @Mapping(target = "solutions", ignore = true)
    @Mapping(target = "questionSet", ignore = true)
    @Mapping(target = "lastModifiedDate", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    DemographicQuestion toQuestion(QuestionVM questionVM);

    Collection<DemographicQuestionVM> toQuestionVMs(Collection<DemographicQuestion> questions);
}
