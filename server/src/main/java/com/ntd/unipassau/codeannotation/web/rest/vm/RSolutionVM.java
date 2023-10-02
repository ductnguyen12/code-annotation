package com.ntd.unipassau.codeannotation.web.rest.vm;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ntd.unipassau.codeannotation.domain.rquestion.RSolutionValue;
import jakarta.validation.constraints.NotNull;

public record RSolutionVM(
        @NotNull(message = "Question ID is required")
        Long questionId,
        @NotNull
        RSolutionValue value,

        @JsonProperty(access = JsonProperty.Access.READ_ONLY)
        RQuestionVM question
) {
}
