package com.ntd.unipassau.codeannotation.web.rest.vm;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DatasetStatistics {
    private int numberOfSnippets;
    private int numberOfParticipants;
    private double averageRating;
    private DatasetVM dataset;
}
