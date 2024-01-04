package com.ntd.unipassau.codeannotation.web.rest.vm;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ntd.unipassau.codeannotation.domain.prediction.ModelExecutionType;
import com.ntd.unipassau.codeannotation.domain.prediction.OutputFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.Instant;
import java.util.Map;

@Data
public class ModelVM {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long id;

    @NotBlank
    private String name;

    @NotNull
    private ModelExecutionType executionType;

    @NotNull
    private OutputFormat outputFormat;

    private Double ratingScale = 1d;
    private Map<String, Object> config;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Instant lastModifiedDate;
}
