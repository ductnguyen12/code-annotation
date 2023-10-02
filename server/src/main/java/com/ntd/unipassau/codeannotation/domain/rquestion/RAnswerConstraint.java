package com.ntd.unipassau.codeannotation.domain.rquestion;

import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class RAnswerConstraint {
    private Boolean required;
    private Boolean isNumber;
}
