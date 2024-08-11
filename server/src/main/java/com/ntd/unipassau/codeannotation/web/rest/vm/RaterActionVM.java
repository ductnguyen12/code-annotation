package com.ntd.unipassau.codeannotation.web.rest.vm;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@Data
public class RaterActionVM {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long id;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private UUID raterId;

    @NotNull(message = "datasetId is required")
    private Long datasetId;

    @NotBlank(message = "action is required")
    private String action;

    private Map<String, Object> data;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Instant createdDate;
}
