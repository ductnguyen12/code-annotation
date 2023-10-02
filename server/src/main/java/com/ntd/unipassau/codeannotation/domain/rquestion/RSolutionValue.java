package com.ntd.unipassau.codeannotation.domain.rquestion;

import lombok.Data;

import java.util.Collection;

@Data
public class RSolutionValue {
    private Object input;
    private Collection<Integer> selected;
}
