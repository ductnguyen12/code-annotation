package com.ntd.unipassau.codeannotation.export.model;

import lombok.Data;

import java.util.Collection;

@Data
public class RateDoc {
    private String comment;
    private Integer rate;
    private String rater;
    private String raterExternalId;
    private String raterExternalSystem;
    private Collection<SolutionDoc> solutions;
}
