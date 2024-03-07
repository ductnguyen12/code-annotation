package com.ntd.unipassau.codeannotation.service;

import com.ntd.unipassau.codeannotation.domain.dataset.Dataset;
import com.ntd.unipassau.codeannotation.domain.rater.Solution;
import com.ntd.unipassau.codeannotation.integration.prolific.ProlificProps;
import com.ntd.unipassau.codeannotation.integration.prolific.ProlificPropsParser;
import com.ntd.unipassau.codeannotation.integration.prolific.impl.ProlificService;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Map;

@Service
public final class RaterMgmtServiceFactory {
    public RaterMgmtService create(Dataset dataset) {
        Map<String, Map<String, Object>> configuration = dataset.getConfiguration();
        if (configuration == null)
            return new LocalRaterMgmtService();

        if (configuration.containsKey(ProlificPropsParser.PROLIFIC_CONFIG_KEY)) {
            return createProlificService(dataset);
        }

        return new LocalRaterMgmtService();
    }

    private RaterMgmtService createProlificService(Dataset dataset) {
        ProlificPropsParser prolificPropsParser = new ProlificPropsParser();
        ProlificProps prolificProps = prolificPropsParser.extractProlificProps(dataset.getConfiguration())
                .orElseThrow(() -> new RuntimeException(
                        "Invalid prolific configuration of dataset " + dataset.getId()));
        return new ProlificService(prolificProps);
    }

    private static class LocalRaterMgmtService implements RaterMgmtService {
        @Override
        public Collection<Solution> getVerifiedSolutions(Collection<Solution> solutions) {
            return solutions;
        }
    }
}
