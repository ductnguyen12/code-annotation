package com.ntd.unipassau.codeannotation.mapper;

import com.ntd.unipassau.codeannotation.domain.rquestion.RQuestion;
import com.ntd.unipassau.codeannotation.domain.rquestion.RQuestionSet;
import com.ntd.unipassau.codeannotation.web.rest.vm.RQuestionSetVM;
import com.ntd.unipassau.codeannotation.web.rest.vm.RQuestionVM;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.Collection;

@Mapper(componentModel = "spring")
public interface RQuestionMapper {
    RQuestionSetVM toQuestionSetVM(RQuestionSet questionSet);

    @Mapping(target = "questions", ignore = true)
    @Mapping(target = "lastModifiedDate", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    RQuestionSet toQuestionSet(RQuestionSetVM questionSetVM);

    Collection<RQuestionSetVM> toQuestionSetVMs(Collection<RQuestionSet> questionSets);

    @Mapping(target = "questionSetId", ignore = true)
    @Mapping(target = "constraint", source = "answerConstraint")
    RQuestionVM toQuestionVM(RQuestion question);

    @Mapping(target = "questionSet", ignore = true)
    @Mapping(target = "lastModifiedDate", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "answerConstraint", source = "constraint")
    RQuestion toQuestion(RQuestionVM questionVM);

    Collection<RQuestionVM> toQuestionVMs(Collection<RQuestion> questions);
}
