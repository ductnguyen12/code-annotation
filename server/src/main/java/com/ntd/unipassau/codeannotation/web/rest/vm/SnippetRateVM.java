package com.ntd.unipassau.codeannotation.web.rest.vm;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ntd.unipassau.codeannotation.web.rest.constraint.SolutionsConstraint;
import jakarta.validation.constraints.NotNull;

import java.util.Collection;

public record SnippetRateVM(
        Integer value,
        String comment,
        @SolutionsConstraint
        Collection<@NotNull(message = "A solution can not be null") SolutionVM> solutions,
        @JsonProperty(access = JsonProperty.Access.READ_ONLY)
        SnippetVM snippet,
        @JsonProperty(access = JsonProperty.Access.READ_ONLY)
        RaterVM rater
) {
}
