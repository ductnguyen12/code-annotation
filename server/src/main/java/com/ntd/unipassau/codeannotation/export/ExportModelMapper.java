package com.ntd.unipassau.codeannotation.export;

import com.ntd.unipassau.codeannotation.domain.dataset.Snippet;
import com.ntd.unipassau.codeannotation.domain.question.Question;
import com.ntd.unipassau.codeannotation.export.model.QuestionDoc;
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
    @Mapping(target = "rate.comment", source = "comment")
    @Mapping(target = "rate.value", source = "rate")
    @Mapping(target = "rate.createdBy", source = "rater")
    @Mapping(target = "rate.lastModifiedBy", source = "rater")
    @Mapping(target = "rate.rater.id", source = "rater")
    Snippet toSnippet(SnippetDoc snippet);

    @AfterMapping
    default void afterToSnippet(@MappingTarget Snippet snippet) {
        // Ensure bi-directional relation
        snippet.getQuestions().forEach(q -> {
            q.setSnippet(snippet);
        });
        if (snippet.getRate() != null) {
            snippet.getRate().setSnippet(snippet);
        }
    }
}
