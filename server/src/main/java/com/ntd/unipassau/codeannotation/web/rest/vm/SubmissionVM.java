package com.ntd.unipassau.codeannotation.web.rest.vm;

import lombok.Data;

import java.util.Date;

@Data
public class SubmissionVM {
    private String id;
    private RaterVM rater;
    private Date completedAt;
    private Date startedAt;
    private String status;
    private String studyCode;
    private int numberOfRatings;
    private int numberOfSnippets;
    private int passedAttentionCheck;
    private int totalAttentionCheck;
}
