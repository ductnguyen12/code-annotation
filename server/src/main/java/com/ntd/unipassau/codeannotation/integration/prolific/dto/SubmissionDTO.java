package com.ntd.unipassau.codeannotation.integration.prolific.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Date;

@Data
public class SubmissionDTO {
    private String id;

    @JsonProperty("participant_id")
    @NotBlank(message = "participant_id must not be blank")
    private String participantId;

    @NotNull(message = "status must not be null")
    private SubmissionStatus status;

    @JsonProperty("started_at")
    public Date startedAt;

    @JsonProperty("completed_at")
    public Date completedAt;

    @JsonProperty("has_siblings")
    private boolean hasSiblings;

    @JsonProperty("study_code")
    private String studyCode;
}
