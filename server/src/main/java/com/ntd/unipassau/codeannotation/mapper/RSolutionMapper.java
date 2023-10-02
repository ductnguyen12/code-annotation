package com.ntd.unipassau.codeannotation.mapper;

import com.ntd.unipassau.codeannotation.domain.rquestion.RSolution;
import com.ntd.unipassau.codeannotation.web.rest.vm.RSolutionVM;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.Collection;

@Mapper(componentModel = "spring", uses = {RQuestionMapper.class})
public interface RSolutionMapper {

    @Mapping(target = "value", source = "solution")
    @Mapping(target = "questionId", source = "question.id")
    RSolutionVM toSolutionVM(RSolution solution);

    @Mapping(target = "rater", ignore = true)
    @Mapping(target = "question", ignore = true)
    @Mapping(target = "lastModifiedDate", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "id.questionId", source = "questionId")
    @Mapping(target = "solution", source = "value")
    RSolution toSolution(RSolutionVM solutionVM);

    Collection<RSolutionVM> toSolutionVMs(Collection<RSolution> solutions);
}
