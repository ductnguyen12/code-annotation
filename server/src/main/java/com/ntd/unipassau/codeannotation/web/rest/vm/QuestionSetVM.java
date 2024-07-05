package com.ntd.unipassau.codeannotation.web.rest.vm;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.Collection;
import java.util.Map;

@Data
public class QuestionSetVM implements QuestionPriorityMap {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long id;

    @NotBlank(message = "Question-set title is required")
    private String title;
    private String description;
    private int priority;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Map<Long, Integer> priorityMap;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Collection<? extends QuestionVM> questions;
}
