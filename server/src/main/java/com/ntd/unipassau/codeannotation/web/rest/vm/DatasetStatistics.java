package com.ntd.unipassau.codeannotation.web.rest.vm;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DatasetStatistics {
    private int numberOfSnippets;
    private int numberOfParticipants;
    private double averageRating;
    private Map<Long, SnippetStatistics> snippets;
    private DatasetVM dataset;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SnippetStatistics {
        private double averageRating;
        private int numberOfParticipants;
    }
}
