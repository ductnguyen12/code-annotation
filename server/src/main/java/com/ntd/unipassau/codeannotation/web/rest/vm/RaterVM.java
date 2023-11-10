package com.ntd.unipassau.codeannotation.web.rest.vm;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ntd.unipassau.codeannotation.web.rest.constraint.SolutionsConstraint;
import jakarta.validation.constraints.NotNull;

import java.util.Collection;
import java.util.UUID;

public record RaterVM(
        @JsonProperty(access = JsonProperty.Access.READ_ONLY)
        UUID id,
        String externalId,
        String externalSystem,
        @NotNull
        @SolutionsConstraint
        Collection<@NotNull SolutionVM> solutions
) {
}
