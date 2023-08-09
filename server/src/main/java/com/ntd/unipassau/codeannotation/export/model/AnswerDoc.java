package com.ntd.unipassau.codeannotation.export.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AnswerDoc {
    private String content;
    private boolean rightAnswer;
    private boolean selected;
}
