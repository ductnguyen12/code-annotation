package com.ntd.unipassau.codeannotation.export;

import com.ntd.unipassau.codeannotation.domain.dataset.Snippet;
import com.ntd.unipassau.codeannotation.domain.rater.SnippetRate;
import com.ntd.unipassau.codeannotation.domain.rater.Solution;
import com.ntd.unipassau.codeannotation.export.model.RateDoc;
import com.ntd.unipassau.codeannotation.export.model.SnippetDoc;
import com.ntd.unipassau.codeannotation.export.model.SolutionDoc;
import org.mapstruct.*;

import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface ExportModelMapper {
    @BeanMapping(resultType = SnippetDoc.class)
    SnippetDoc toSnippetDoc(Snippet snippet);

    @Mapping(target = "solutions", ignore = true)
    @Mapping(target = "rate", source = "value")
    @Mapping(target = "rater", source = "rater.id")
    RateDoc toRateDoc(SnippetRate rate);

    Collection<RateDoc> toRateDoc(Collection<SnippetRate> rates);

    @Mapping(target = "questionId", source = "id.questionId")
    @Mapping(target = "rater", source = "id.raterId")
    SolutionDoc toSolutionDoc(Solution solution);

    @Mapping(target = "lastModifiedDate", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "dataset", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "code", ignore = true)
    @Mapping(target = "rates", ignore = true)
    Snippet toSnippet(SnippetDoc snippet);

    @Mapping(target = "value", ignore = true)
    @Mapping(target = "snippet", ignore = true)
    @Mapping(target = "lastModifiedDate", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "rater.id", source = "rater")
    SnippetRate toSnippetRate(RateDoc rateDoc);

    Collection<SnippetRate> toSnippetRate(Collection<RateDoc> rateDocs);

    @AfterMapping
    default void afterToSnippet(SnippetDoc snippetDoc, @MappingTarget Snippet snippet) {
        // Ensure bi-directional relation
        snippet.getQuestions().forEach(q -> {
            q.setSnippet(snippet);
        });
        if (snippetDoc.getRates() != null) {
            Collection<SnippetRate> snippetRates = toSnippetRate(snippetDoc.getRates());
            snippetRates.forEach(sr -> {
                sr.setSnippet(snippet);
                // Prevent rater with null id
                if (null == sr.getRater().getId())
                    sr.setRater(null);
            });
            snippet.setRates(new LinkedHashSet<>(snippetRates));
        }
    }

    @AfterMapping
    default void afterToSnippetDoc(Snippet snippet, @MappingTarget SnippetDoc snippetDoc) {
        if (snippetDoc.getRates() != null) {
            Set<SolutionDoc> solutionDocs = snippet.getQuestions().stream()
                    .flatMap(q -> q.getSolutions().stream())
                    .map(this::toSolutionDoc)
                    .collect(Collectors.toSet());
            snippetDoc.getRates().forEach(r -> {
                Set<SolutionDoc> raterSolutions = solutionDocs.stream()
                        .filter(s -> s.getRater() != null && s.getRater().equals(r.getRater()))
                        .collect(Collectors.toSet());
                r.setSolutions(raterSolutions);
            });
        }
    }
}
