package com.ntd.unipassau.codeannotation.mapper;

import com.ntd.unipassau.codeannotation.domain.rater.Solution;
import com.ntd.unipassau.codeannotation.web.rest.vm.SolutionVM;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.Collection;

@Mapper(componentModel = "spring", uses = {DemographicQuestionMapper.class})
public interface SolutionMapper {

    @Mapping(target = "raterId", source = "id.raterId")
    @Mapping(target = "value", source = "solution")
    @Mapping(target = "questionId", source = "id.questionId")
    SolutionVM toSolutionVM(Solution solution);

    @Mapping(target = "rater", ignore = true)
    @Mapping(target = "question", ignore = true)
    @Mapping(target = "lastModifiedDate", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "id.raterId", source = "raterId")
    @Mapping(target = "id.questionId", source = "questionId")
    @Mapping(target = "solution", source = "value")
    Solution toSolution(SolutionVM solutionVM);

    Collection<SolutionVM> toSolutionVMs(Collection<Solution> solutions);
}
