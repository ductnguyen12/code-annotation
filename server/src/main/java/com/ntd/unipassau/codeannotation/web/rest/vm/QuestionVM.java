package com.ntd.unipassau.codeannotation.web.rest.vm;

import com.fasterxml.jackson.annotation.JsonProperty;
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
    private Collection<@NotNull(message = "Answer can not be null") AnswerVM> answers;
}
