package com.ntd.unipassau.codeannotation.prediction.reader;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
@Data
public class RegexPredictionReader implements PredictionReader {
    private Pattern pattern;
    private Collection<Integer> ignoreLines = new LinkedHashSet<>();

    public RegexPredictionReader(String regex) {
        this(regex, Set.of());
    }

    public RegexPredictionReader(String regex, Collection<Integer> ignoreLines) {
        this.pattern = Pattern.compile(regex);
        if (ignoreLines != null)
            this.ignoreLines.addAll(ignoreLines);
    }

    @Override
    public Map<String, Double> readLines(List<String> lines) {
        Map<String, Double> results = new LinkedHashMap<>();
        for (int i = 0; i < lines.size(); i++) {
            if (ignoreLines.contains(i))
                continue;
            List<String> split = readline(lines.get(i));
            if (split.size() != 2)
                continue;
            try {
                results.putIfAbsent(split.get(0), Double.parseDouble(split.get(1)));
            } catch (NumberFormatException e) {
                log.warn("Prediction value is not a number will be skipped: " + lines.get(i));
            }
        }
        return results;
    }

    private List<String> readline(String line) {
        List<String> results = new ArrayList<>();
        Matcher matcher = pattern.matcher(line);
        while (matcher.find()) {
            for (int i = 1; i <= matcher.groupCount(); i++) {
                results.add(matcher.group(i));
            }
        }
        return results;
    }
}
