package com.ntd.unipassau.codeannotation.domain.question;

import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class AnswerConstraint {
    private Boolean required;
    private Boolean isNumber;
}
