package com.ntd.unipassau.codeannotation.web.rest.vm;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Collection;

@Data
@EqualsAndHashCode(callSuper = true)
public class DemographicQuestionVM extends QuestionVM {
    private Long parentId;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Collection<DemographicQuestionVM> subQuestions;

    public void setGroupIds(Collection<@NotNull Long> groupIds) {
        super.setQuestionSetIds(groupIds);
    }

    public Collection<Long> getGroupIds() {
        return getQuestionSetIds();
    }
}
