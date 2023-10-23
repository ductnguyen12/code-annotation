package com.ntd.unipassau.codeannotation.web.rest.vm;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class SnippetQuestionVM extends QuestionVM {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private SolutionVM solution;
}
