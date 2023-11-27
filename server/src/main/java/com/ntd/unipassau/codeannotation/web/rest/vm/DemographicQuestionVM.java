package com.ntd.unipassau.codeannotation.web.rest.vm;

import jakarta.validation.constraints.NotNull;

import java.util.Collection;

public class DemographicQuestionVM extends QuestionVM {
    public void setGroupIds(Collection<@NotNull Long> groupIds) {
        super.setQuestionSetIds(groupIds);
    }

    public Collection<Long> getGroupIds() {
        return getQuestionSetIds();
    }
}
