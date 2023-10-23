package com.ntd.unipassau.codeannotation.mapper;

import com.ntd.unipassau.codeannotation.domain.dataset.Snippet;
import com.ntd.unipassau.codeannotation.domain.dataset.SnippetQuestion;
import com.ntd.unipassau.codeannotation.domain.rater.SnippetRate;
import com.ntd.unipassau.codeannotation.web.rest.vm.SnippetQuestionVM;
import com.ntd.unipassau.codeannotation.web.rest.vm.SnippetRateVM;
import com.ntd.unipassau.codeannotation.web.rest.vm.SnippetVM;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.Collection;

@Mapper(componentModel = "spring", uses = {SolutionMapper.class})
public interface SnippetMapper {
    @Mapping(target = "rate", ignore = true)
    @Mapping(target = "datasetId", source = "dataset.id")
    SnippetVM toSnippetVM(Snippet snippet);

    Collection<SnippetVM> toSnippetVMs(Collection<Snippet> snippets);

    @Mapping(target = "rates", ignore = true)
    @Mapping(target = "dataset", ignore = true)
    @Mapping(target = "lastModifiedDate", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    Snippet toSnippet(SnippetVM snippetVM);

    @Mapping(target = "questionSetId", source = "questionSet.id")
    SnippetQuestionVM toSnippetQuestionVM(SnippetQuestion snippetQuestion);

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
