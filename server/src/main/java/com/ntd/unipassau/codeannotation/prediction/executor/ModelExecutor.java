package com.ntd.unipassau.codeannotation.prediction.executor;

import com.ntd.unipassau.codeannotation.domain.dataset.Dataset;
import com.ntd.unipassau.codeannotation.domain.prediction.Model;
import com.ntd.unipassau.codeannotation.domain.prediction.PredictedRating;

import java.util.Collection;

public interface ModelExecutor {
    Collection<PredictedRating> predict(Model model, Dataset dataset);
}
