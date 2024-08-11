package com.ntd.unipassau.codeannotation.export.model;

import lombok.Data;

import java.time.Instant;
import java.util.Map;

@Data
public class RaterActionDoc {
    private Long id;
    private String action;
    private Map<String, Object> data;
    private Long datasetId;
    private String rater;
    private String raterExternalId;
    private Instant createdDate;
}
