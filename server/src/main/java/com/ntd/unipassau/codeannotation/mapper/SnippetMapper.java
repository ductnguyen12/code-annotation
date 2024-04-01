package com.ntd.unipassau.codeannotation.mapper;

import com.ntd.unipassau.codeannotation.domain.dataset.Snippet;
import com.ntd.unipassau.codeannotation.domain.dataset.SnippetQuestion;
import com.ntd.unipassau.codeannotation.domain.rater.SnippetRate;
import com.ntd.unipassau.codeannotation.web.rest.vm.SnippetQuestionVM;
import com.ntd.unipassau.codeannotation.web.rest.vm.SnippetRateVM;
import com.ntd.unipassau.codeannotation.web.rest.vm.SnippetVM;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {SolutionMapper.class})
public interface SnippetMapper {
    @Mapping(target = "rate", ignore = true)
    @Mapping(target = "rates", ignore = true)
    SnippetVM toSimpleSnippetVM(Snippet snippet);

    @Mapping(target = "rate", ignore = true)
    SnippetVM toSnippetVM(Snippet snippet);

    @Mapping(target = "predictedRatings", ignore = true)
    @Mapping(target = "rates", ignore = true)
    @Mapping(target = "dataset", ignore = true)
    @Mapping(target = "lastModifiedDate", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    Snippet toSnippet(SnippetVM snippetVM);

    @Mapping(target = "questionSetIds", ignore = true)
    SnippetQuestionVM toSnippetQuestionVM(SnippetQuestion snippetQuestion);

    @Mapping(target = "snippet", ignore = true)
    @Mapping(target = "questionSets", ignore = true)
    @Mapping(target = "lastModifiedDate", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    @Mapping(target = "dtype", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    SnippetQuestion toSnippetQuestion(SnippetQuestionVM snippetQuestion);

    @Mapping(target = "solutions", ignore = true)
    @Mapping(target = "rater.solutions", ignore = true)
    SnippetRateVM toSnippetRateVM(SnippetRate rate);

    @Mapping(target = "snippet", ignore = true)
    @Mapping(target = "lastModifiedDate", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    SnippetRate toSnippetRate(SnippetRateVM rateVM);
}
