package com.ntd.unipassau.codeannotation.web.rest.vm;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.Collection;
import java.util.Map;
import java.util.Optional;

public interface QuestionPriorityMap {
    Map<Long, Integer> getPriorityMap();

    default boolean hasQuestionPriority() {
        Map<Long, Integer> priorityMap = getPriorityMap();
        return priorityMap != null && !priorityMap.isEmpty();
    }

    @JsonIgnore
    default Collection<Long> getQuestionIds() {
        return getPriorityMap().keySet();
    }

    default Optional<Integer> getPriorityByQuestionId(Long questionId) {
        return Optional.ofNullable(getPriorityMap().getOrDefault(questionId, null));
    }
}
