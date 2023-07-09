package com.ntd.unipassau.codeannotation.mapper;

import com.ntd.unipassau.codeannotation.domain.Snippet;
import com.ntd.unipassau.codeannotation.domain.SnippetRate;
import com.ntd.unipassau.codeannotation.web.rest.vm.SnippetRateVM;
import com.ntd.unipassau.codeannotation.web.rest.vm.SnippetVM;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.Collection;

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

    @Mapping(target = "snippet", ignore = true)
    @Mapping(target = "lastModifiedDate", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    SnippetRate toSnippetRate(SnippetRateVM rateVM);

    SnippetRateVM toSnippetRateVM(SnippetRate rate);
}
