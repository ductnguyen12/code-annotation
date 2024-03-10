package com.ntd.unipassau.codeannotation.integration.prolific.impl;

import com.ntd.unipassau.codeannotation.domain.dataset.Dataset;
import com.ntd.unipassau.codeannotation.domain.rater.Rater;
import com.ntd.unipassau.codeannotation.domain.rater.Solution;
import com.ntd.unipassau.codeannotation.integration.prolific.ProlificClient;
import com.ntd.unipassau.codeannotation.integration.prolific.ProlificProps;
import com.ntd.unipassau.codeannotation.integration.prolific.SubmissionMapper;
import com.ntd.unipassau.codeannotation.integration.prolific.dto.SubmissionDTO;
import com.ntd.unipassau.codeannotation.repository.RaterRepository;
import com.ntd.unipassau.codeannotation.service.RaterMgmtService;
import com.ntd.unipassau.codeannotation.web.rest.vm.SubmissionVM;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.Collection;
import java.util.Comparator;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

public class ProlificService implements RaterMgmtService {
    private final ProlificProps prolificProps;
    private final ProlificClient prolificClient;
    private final SubmissionMapper submissionMapper;
    private final RaterRepository raterRepository;

    public ProlificService(
            ProlificProps prolificProps,
            SubmissionMapper submissionMapper,
            RaterRepository raterRepository) {
        this.prolificProps = prolificProps;
        this.submissionMapper = submissionMapper;
        this.prolificClient = new HttpProlificClient(prolificProps);
        this.raterRepository = raterRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public Collection<SubmissionVM> listSubmissions(Dataset dataset) {
        Map<String, Rater> raterMap = raterRepository.findAllRatersByDatasetId(dataset.getId()).stream()
                .filter(r -> r.getExternalId() != null)
                .collect(Collectors.toMap(Rater::getExternalId, r -> r));
        try {
            Collection<SubmissionDTO> submissions = prolificClient.listSubmissions()
                    .getResults();

            return submissions.stream()
                    .filter(s -> s.getStudyCode() == null
                            || s.getStudyCode().equals(prolificProps.getCompleteCode()))
                    .filter(s -> raterMap.containsKey(s.getParticipantId()))
                    .map(dto -> submissionMapper.toSubmissionVM(dto, raterMap.get(dto.getParticipantId())))
                    .sorted(Comparator.comparing(SubmissionVM::getId, Comparator.reverseOrder()))
                    .toList();
        } catch (WebClientResponseException e) {
            throw new RuntimeException("Failed to fetch prolific submissions: " + e.getResponseBodyAsString(), e);
        }
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
