package com.ntd.unipassau.codeannotation.prediction;

import com.ntd.unipassau.codeannotation.domain.prediction.ModelExecutionType;
import com.ntd.unipassau.codeannotation.domain.prediction.OutputFormat;
import com.ntd.unipassau.codeannotation.prediction.executor.JarModelExecutor;
import com.ntd.unipassau.codeannotation.prediction.executor.ModelExecutor;
import com.ntd.unipassau.codeannotation.prediction.reader.PredictionReader;
import com.ntd.unipassau.codeannotation.prediction.reader.RegexPredictionReader;

import java.util.List;

public final class PredictionFactory {

    public static ModelExecutor create(ModelExecutionType type, PredictionReader reader) {
        return switch (type) {
            case COMMAND_LINE -> new JarModelExecutor(reader);
            default -> throw new UnsupportedOperationException("Unsupported execution type: " + type);
        };
    }

    public static PredictionReader create(OutputFormat format) {
        return switch (format) {
            case RSE -> new RegexPredictionReader("(.*):{0,1}\\s([0-9]*[.][0-9]*|NaN)", List.of(0));
            default -> throw new UnsupportedOperationException("Unsupported output format: " + format);
        };
    }
}
