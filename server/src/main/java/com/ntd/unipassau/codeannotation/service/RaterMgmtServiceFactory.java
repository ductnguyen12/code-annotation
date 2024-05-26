package com.ntd.unipassau.codeannotation.service;

import com.ntd.unipassau.codeannotation.domain.dataset.Dataset;
import com.ntd.unipassau.codeannotation.integration.prolific.ProlificProps;
import com.ntd.unipassau.codeannotation.integration.prolific.ProlificPropsParser;
import com.ntd.unipassau.codeannotation.integration.prolific.SubmissionMapper;
import com.ntd.unipassau.codeannotation.integration.prolific.impl.ProlificService;
import com.ntd.unipassau.codeannotation.repository.RaterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public final class RaterMgmtServiceFactory {
    private final SubmissionMapper submissionMapper;
    private final RaterRepository raterRepository;
    private final LocalRaterMgmtService localRaterMgmtService;

    @Autowired
    public RaterMgmtServiceFactory(
            SubmissionMapper submissionMapper,
            RaterRepository raterRepository,
            LocalRaterMgmtService localRaterMgmtService) {
        this.submissionMapper = submissionMapper;
        this.raterRepository = raterRepository;
        this.localRaterMgmtService = localRaterMgmtService;
    }

    public RaterMgmtService create(Dataset dataset) {
        Map<String, Map<String, Object>> configuration = dataset.getConfiguration();
        if (configuration == null)
            return localRaterMgmtService;

        if (configuration.containsKey(ProlificPropsParser.PROLIFIC_CONFIG_KEY)) {
            return createProlificService(dataset);
        }

        return localRaterMgmtService;
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
}
