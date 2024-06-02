package com.ntd.unipassau.codeannotation.web.rest.vm;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.util.CollectionUtils;

import java.util.Collection;

@Data
@EqualsAndHashCode(callSuper = true)
public class SnippetQuestionVM extends QuestionVM {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Collection<SolutionVM> solutions;

    private Long snippetId;

    private Boolean hidden;

    public SolutionVM getSolution() {
        if (CollectionUtils.isEmpty(solutions))
            return null;
        return solutions.iterator().next();
    }
}
