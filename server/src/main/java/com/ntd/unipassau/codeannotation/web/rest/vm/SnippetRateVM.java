package com.ntd.unipassau.codeannotation.web.rest.vm;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Collection;

@Data
public class SnippetRateVM {
    private Integer value;
    private String comment;
    private Collection<@NotNull(message = "A selected answer can not be null") Long> selectedAnswers;
}
