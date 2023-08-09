package com.ntd.unipassau.codeannotation.export.model;

import lombok.Builder;
import lombok.Data;

import java.util.Collection;

@Data
@Builder
public class QuestionDoc {
    private String content;
    private Collection<AnswerDoc> answers;
}
