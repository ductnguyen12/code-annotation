package com.ntd.unipassau.codeannotation.export.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class SnippetQuestionDoc extends QuestionDoc {
    private Integer priority;
    private Boolean hidden;
}
