package com.ntd.unipassau.codeannotation.export.model;

import com.ntd.unipassau.codeannotation.domain.rater.SolutionValue;
import lombok.Data;

@Data
public class SolutionDoc {
    private Long questionId;
    private String rater;
    private SolutionValue solution;
}
