package com.ntd.unipassau.codeannotation.web.rest.vm;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ntd.unipassau.codeannotation.web.rest.constraint.SolutionsConstraint;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Collection;

@Data
public class SnippetRateVM {
    private Integer value;
    private String comment;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @NotNull(message = "Question solutions must not be null")
    @SolutionsConstraint
    private Collection<@NotNull(message = "A solution can not be null") SolutionVM> solutions;
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private RaterVM rater;
}
