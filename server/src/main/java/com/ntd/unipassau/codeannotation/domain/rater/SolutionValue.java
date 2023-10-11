package com.ntd.unipassau.codeannotation.domain.rater;

import lombok.Data;

import java.util.Collection;

@Data
public class SolutionValue {
    private Object input;
    private Collection<Integer> selected;
}
