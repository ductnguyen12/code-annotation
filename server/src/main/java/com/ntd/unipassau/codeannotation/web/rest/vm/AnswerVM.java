package com.ntd.unipassau.codeannotation.web.rest.vm;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class AnswerVM {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long id;
    private String content;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Boolean rightAnswer = false;
}
