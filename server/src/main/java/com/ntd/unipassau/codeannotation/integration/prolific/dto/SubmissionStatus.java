package com.ntd.unipassau.codeannotation.integration.prolific.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum SubmissionStatus {
    RESERVED,
    ACTIVE,
    @JsonProperty("TIMED-OUT")
    TIMEOUT,
    @JsonProperty("AWAITING REVIEW")
    AWAITING_REVIEW,
    APPROVED,
    RETURNED,
    REJECTED,
    ;
}
