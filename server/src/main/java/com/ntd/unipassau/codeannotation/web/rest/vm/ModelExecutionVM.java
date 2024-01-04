package com.ntd.unipassau.codeannotation.web.rest.vm;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ntd.unipassau.codeannotation.domain.RequestState;
import com.ntd.unipassau.codeannotation.domain.prediction.PredictionTarget;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
public class ModelExecutionVM {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private UUID id;

    private PredictionTarget targetType;
    private Long targetId;
    private Long modelId;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private RequestState state;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String errorMsg;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Instant lastModifiedDate;
}
