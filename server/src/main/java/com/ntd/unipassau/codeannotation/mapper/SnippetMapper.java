package com.ntd.unipassau.codeannotation.mapper;

import com.ntd.unipassau.codeannotation.domain.RateAnswer;
import com.ntd.unipassau.codeannotation.domain.Snippet;
import com.ntd.unipassau.codeannotation.domain.SnippetRate;
import com.ntd.unipassau.codeannotation.web.rest.vm.SnippetRateVM;
import com.ntd.unipassau.codeannotation.web.rest.vm.SnippetVM;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.Collection;
import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface SnippetMapper {
    @Mapping(target = "datasetId", source = "dataset.id")
    SnippetVM toSnippetVM(Snippet snippet);

    Collection<SnippetVM> toSnippetVMs(Collection<Snippet> datasets);

    @Mapping(target = "rate", ignore = true)
    @Mapping(target = "dataset", ignore = true)
    @Mapping(target = "lastModifiedDate", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    Snippet toSnippet(SnippetVM snippetVM);

    @Mapping(target = "answers", ignore = true)
    @Mapping(target = "snippet", ignore = true)
    @Mapping(target = "lastModifiedDate", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    SnippetRate toSnippetRate(SnippetRateVM rateVM);

    @Mapping(target = "selectedAnswers", source = "answers", qualifiedByName = "toSelectedAnswers")
    SnippetRateVM toSnippetRateVM(SnippetRate rate);

    @Named("toSelectedAnswers")
    static Collection<Long> toSelectedAnswers(Set<RateAnswer> answers) {
        if (answers == null) {
            return Collections.emptyList();
        }
        return answers.stream().map(RateAnswer::getId).collect(Collectors.toList());
    }
}
