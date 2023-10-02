package com.ntd.unipassau.codeannotation.domain.rquestion;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class RAnswer {
    private List<String> options = new ArrayList<>();
    private List<String> attributes = new ArrayList<>();
    // The positions of options that support text input
    private List<Integer> inputPositions = new ArrayList<>();
}
