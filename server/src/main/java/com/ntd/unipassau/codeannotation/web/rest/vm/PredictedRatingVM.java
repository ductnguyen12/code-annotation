package com.ntd.unipassau.codeannotation.web.rest.vm;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.time.Instant;
import java.util.Map;

@Data
public class PredictedRatingVM {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long snippetId;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long modelId;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Double value;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Map<String, Double> metrics;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Instant lastModifiedDate;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private ModelExecutionVM execution;
}
