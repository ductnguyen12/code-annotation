package com.ntd.unipassau.codeannotation.web.rest.vm;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;

public record QuestionSetVM(
        @JsonProperty(access = JsonProperty.Access.READ_ONLY)
        Long id,
        @NotBlank(message = "Question-set title is required")
        String title,
        String description,
        int priority
) {
}
