package com.ntd.unipassau.codeannotation.export.model;

import com.ntd.unipassau.codeannotation.domain.question.Answer;
import com.ntd.unipassau.codeannotation.domain.question.QuestionType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionDoc {
    private Long id;
    private String content;
    private QuestionType type;
    private Answer answer;
}
