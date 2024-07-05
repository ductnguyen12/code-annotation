package com.ntd.unipassau.codeannotation.web.rest.vm;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Map;

@Data
public class SnippetQuestionPriority implements QuestionPriorityMap {
    @NotNull(message = "priorityMap is required")
    private Map<Long, @NotNull(message = "priority is required") Integer> priorityMap;
}
