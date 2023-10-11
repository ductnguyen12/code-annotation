package com.ntd.unipassau.codeannotation.domain.question;

import lombok.Data;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Data
public class Answer {
    private List<String> options = new ArrayList<>();
    private List<String> attributes = new ArrayList<>();
    // The positions of options that support text input
    private List<Integer> inputPositions = new ArrayList<>();
    // Indexes of correct options
    private Collection<Integer> correctChoices = new ArrayList<>();
}
