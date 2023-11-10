package com.ntd.unipassau.codeannotation.integration.prolific;

import java.util.Map;
import java.util.Optional;

public class ProlificPropsParser {
    private final static String PROLIFIC_CONFIG_KEY = "prolific";
    private final static String PROLIFIC_CONFIG_COMPLETE_CODE = "completeCode";

    public Optional<ProlificProps> extractProlificProps(Map<String, Map<String, Object>> configuration) {
        Map<String, Object> rawConfig = configuration.getOrDefault(PROLIFIC_CONFIG_KEY, null);
        return Optional.ofNullable(rawConfig)
                .map(config -> {
                    String completeCode =
                            rawConfig.getOrDefault(PROLIFIC_CONFIG_COMPLETE_CODE, "").toString();
                    if (completeCode.isBlank())
                        return null;
                    return ProlificProps.builder()
                            .completeCode(completeCode)
                            .build();
                });
    }
}
