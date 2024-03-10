package com.ntd.unipassau.codeannotation.service;

import com.ntd.unipassau.codeannotation.domain.dataset.Dataset;
import com.ntd.unipassau.codeannotation.domain.rater.Solution;
import com.ntd.unipassau.codeannotation.integration.prolific.ProlificProps;
import com.ntd.unipassau.codeannotation.integration.prolific.ProlificPropsParser;
import com.ntd.unipassau.codeannotation.integration.prolific.SubmissionMapper;
import com.ntd.unipassau.codeannotation.integration.prolific.impl.ProlificService;
import com.ntd.unipassau.codeannotation.repository.RaterRepository;
import com.ntd.unipassau.codeannotation.web.rest.vm.SubmissionVM;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Collections;
import java.util.Map;

@Service
public final class RaterMgmtServiceFactory {
    private final SubmissionMapper submissionMapper;
    private final RaterRepository raterRepository;

    @Autowired
    public RaterMgmtServiceFactory(
            SubmissionMapper submissionMapper,
            RaterRepository raterRepository) {
        this.submissionMapper = submissionMapper;
        this.raterRepository = raterRepository;
    }

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
        return new ProlificService(
                prolificProps,
                submissionMapper,
                raterRepository);
    }

    private static class LocalRaterMgmtService implements RaterMgmtService {
        @Override
        public Collection<SubmissionVM> listSubmissions(Dataset dataset) {
            // has not supported yet.
            return Collections.emptyList();
        }

        @Override
        public Collection<Solution> getVerifiedSolutions(Collection<Solution> solutions) {
            return solutions;
        }
    }
}
