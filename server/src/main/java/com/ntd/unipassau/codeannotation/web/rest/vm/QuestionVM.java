package com.ntd.unipassau.codeannotation.web.rest.vm;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.ntd.unipassau.codeannotation.domain.question.Answer;
import com.ntd.unipassau.codeannotation.domain.question.AnswerConstraint;
import com.ntd.unipassau.codeannotation.domain.question.QuestionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Collection;

@Data
public class QuestionVM {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long id;
    @NotBlank(message = "Question content is required")
    private String content;
    @NotNull(message = "Question type is required")
    private QuestionType type;
    private AnswerConstraint constraint;
    private Answer answer;
    @JsonIgnore
    private Collection<Long> questionSetIds;
}
