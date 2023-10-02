package com.ntd.unipassau.codeannotation.web.rest.vm;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ntd.unipassau.codeannotation.domain.rquestion.RAnswer;
import com.ntd.unipassau.codeannotation.domain.rquestion.RAnswerConstraint;
import com.ntd.unipassau.codeannotation.domain.rquestion.RQuestionType;
import com.ntd.unipassau.codeannotation.web.rest.constraint.RQuestionSetId;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RQuestionVM(
        @JsonProperty(access = JsonProperty.Access.READ_ONLY)
        Long id,
        @NotBlank(message = "Question content is required")
        String content,
        @NotNull(message = "Question type is required")
        RQuestionType type,
        RAnswerConstraint constraint,
        RAnswer answer,
        @RQuestionSetId
        Long questionSetId
) {
}
