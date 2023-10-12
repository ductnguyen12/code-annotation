package com.ntd.unipassau.codeannotation.export;

import com.ntd.unipassau.codeannotation.domain.dataset.Snippet;
import com.ntd.unipassau.codeannotation.domain.rater.SnippetRate;
import com.ntd.unipassau.codeannotation.export.model.SnippetDoc;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ExportModelMapper {
    @Mapping(target = "comment", source = "rate.comment")
    @Mapping(target = "rate", source = "rate.value")
    @Mapping(target = "rater", source = "rate.lastModifiedBy")
    SnippetDoc toSnippetDoc(Snippet snippet);

    @Mapping(target = "lastModifiedDate", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "dataset", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "code", ignore = true)
    @Mapping(target = "rate", ignore = true)
    Snippet toSnippet(SnippetDoc snippet);

    @Mapping(target = "snippet", ignore = true)
    @Mapping(target = "lastModifiedDate", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "comment", source = "comment")
    @Mapping(target = "value", source = "rate")
    @Mapping(target = "createdBy", source = "rater")
    @Mapping(target = "lastModifiedBy", source = "rater")
    @Mapping(target = "rater.id", source = "rater")
    SnippetRate toSnippetRate(SnippetDoc snippet);

    @AfterMapping
    default void afterToSnippet(SnippetDoc snippetDoc, @MappingTarget Snippet snippet) {
        // Ensure bi-directional relation
        snippet.getQuestions().forEach(q -> {
            q.setSnippet(snippet);
        });
        if (snippetDoc.getRate() != null) {
            SnippetRate snippetRate = toSnippetRate(snippetDoc);
            snippet.setRate(snippetRate);
            snippetRate.setSnippet(snippet);
            if (null == snippetDoc.getRater())
                snippetRate.setRater(null);
        }
    }
}
