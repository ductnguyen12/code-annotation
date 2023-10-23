package com.ntd.unipassau.codeannotation.export.model;

import com.ntd.unipassau.codeannotation.domain.question.Answer;
import com.ntd.unipassau.codeannotation.domain.question.QuestionType;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class QuestionDoc {
    private String content;
    private QuestionType type;
    private Answer answer;
}
