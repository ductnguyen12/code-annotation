package com.ntd.unipassau.codeannotation.export;

import com.ntd.unipassau.codeannotation.domain.dataset.Snippet;
import com.ntd.unipassau.codeannotation.domain.rater.DemographicQuestion;
import com.ntd.unipassau.codeannotation.domain.rater.RaterAction;
import com.ntd.unipassau.codeannotation.domain.rater.SnippetRate;
import com.ntd.unipassau.codeannotation.domain.rater.Solution;
import com.ntd.unipassau.codeannotation.export.model.*;
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
    @Mapping(target = "raterExternalId", source = "rater.externalId")
    @Mapping(target = "raterExternalSystem", source = "rater.externalSystem")
    RateDoc toRateDoc(SnippetRate rate);

    Collection<RateDoc> toRateDoc(Collection<SnippetRate> rates);

    @Mapping(target = "raterExternalId", source = "rater.externalId")
    @Mapping(target = "questionId", source = "id.questionId")
    @Mapping(target = "rater", source = "id.raterId")
    @Mapping(
            target = "timeTaken",
            expression = "java(solution.getTimeTaken() != null ? solution.getTimeTaken().toMillis() : null)"
    )
    SolutionDoc toSolutionDoc(Solution solution);

    DemographicQuestionDoc toDQuestionDoc(DemographicQuestion question);

    @Mapping(target = "rater", source = "raterId")
    @Mapping(target = "raterExternalId", source = "raterDataset.rater.externalId")
    @Mapping(target = "status", source = "raterDataset.status")
    RaterActionDoc toRaterActionDoc(RaterAction action);

    Collection<RaterActionDoc> toRaterActionDocs(Collection<RaterAction> actions);

    @Mapping(target = "predictedRatings", ignore = true)
    @Mapping(target = "datasetId", ignore = true)
    @Mapping(target = "lastModifiedDate", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "dataset", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "code", ignore = true)
    @Mapping(target = "rates", ignore = true)
    Snippet toSnippet(SnippetDoc snippet);

    @Mapping(target = "raterId", ignore = true)
    @Mapping(target = "snippetId", ignore = true)
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
        if (snippet.getQuestions() != null) {
            // Ensure bi-directional relation
            snippet.getQuestions().forEach(q -> {
                q.setSnippet(snippet);
            });
        }
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
