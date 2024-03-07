package com.ntd.unipassau.codeannotation.integration.prolific.impl;

import com.ntd.unipassau.codeannotation.domain.rater.Solution;
import com.ntd.unipassau.codeannotation.integration.prolific.ProlificClient;
import com.ntd.unipassau.codeannotation.integration.prolific.ProlificProps;
import com.ntd.unipassau.codeannotation.integration.prolific.dto.SubmissionDTO;
import com.ntd.unipassau.codeannotation.service.RaterMgmtService;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.Collection;
import java.util.Set;
import java.util.stream.Collectors;

public class ProlificService implements RaterMgmtService {
    private final ProlificProps prolificProps;
    private final ProlificClient prolificClient;

    public ProlificService(ProlificProps prolificProps) {
        this.prolificProps = prolificProps;
        this.prolificClient = new HttpProlificClient(prolificProps);
    }

    @Override
    public Collection<Solution> getVerifiedSolutions(Collection<Solution> solutions) {
        if (prolificProps.getApiKey() == null)
            return solutions;
        try {
            Collection<SubmissionDTO> submissions = prolificClient.listSubmissions()
                    .getResults();
            Set<String> externalIDs = submissions.stream()
                    .map(SubmissionDTO::getParticipantId)
                    .collect(Collectors.toSet());
            return solutions.stream()
                    .filter(s -> externalIDs.contains(s.getRater().getExternalId()))
                    .collect(Collectors.toSet());
        } catch (WebClientResponseException e) {
            throw new RuntimeException("Failed to fetch prolific submissions", e);
        }
    }
}
