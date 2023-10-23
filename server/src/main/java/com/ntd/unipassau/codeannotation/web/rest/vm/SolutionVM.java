package com.ntd.unipassau.codeannotation.web.rest.vm;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ntd.unipassau.codeannotation.domain.rater.SolutionValue;
import jakarta.validation.constraints.NotNull;

public record SolutionVM(
        @NotNull(message = "Question ID is required")
        Long questionId,
        @NotNull
        SolutionValue value,

        @JsonProperty(access = JsonProperty.Access.READ_ONLY)
        QuestionVM question
) {
}
