package com.ntd.unipassau.codeannotation.prediction.reader;

import java.util.List;
import java.util.Map;

public interface PredictionReader {
    Map<String, Double> readLines(List<String> lines);
}
