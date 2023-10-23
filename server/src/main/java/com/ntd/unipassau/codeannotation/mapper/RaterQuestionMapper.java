package com.ntd.unipassau.codeannotation.mapper;

import com.ntd.unipassau.codeannotation.domain.question.QuestionSet;
import com.ntd.unipassau.codeannotation.domain.rater.RaterQuestion;
import com.ntd.unipassau.codeannotation.web.rest.vm.QuestionSetVM;
import com.ntd.unipassau.codeannotation.web.rest.vm.QuestionVM;
import com.ntd.unipassau.codeannotation.web.rest.vm.RaterQuestionVM;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.Collection;

@Mapper(componentModel = "spring")
public interface RaterQuestionMapper {
    QuestionSetVM toQuestionSetVM(QuestionSet questionSet);

    @Mapping(target = "questions", ignore = true)
    @Mapping(target = "lastModifiedDate", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    QuestionSet toQuestionSet(QuestionSetVM questionSetVM);

    Collection<QuestionSetVM> toQuestionSetVMs(Collection<QuestionSet> questionSets);

    @Mapping(target = "questionSetId", source = "questionSet.id")
    RaterQuestionVM toQuestionVM(RaterQuestion question);

    @Mapping(target = "questionSet", ignore = true)
    @Mapping(target = "lastModifiedDate", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    RaterQuestion toQuestion(QuestionVM questionVM);

    Collection<RaterQuestionVM> toQuestionVMs(Collection<RaterQuestion> questions);
}
