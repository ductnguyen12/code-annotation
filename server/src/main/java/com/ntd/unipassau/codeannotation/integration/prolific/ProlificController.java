package com.ntd.unipassau.codeannotation.integration.prolific;

import com.ntd.unipassau.codeannotation.domain.dataset.Dataset;
import com.ntd.unipassau.codeannotation.domain.rater.Rater;
import com.ntd.unipassau.codeannotation.integration.prolific.dto.SubmissionDTO;
import com.ntd.unipassau.codeannotation.integration.prolific.impl.HttpProlificClient;
import com.ntd.unipassau.codeannotation.repository.DatasetRepository;
import com.ntd.unipassau.codeannotation.repository.RaterRepository;
import com.ntd.unipassau.codeannotation.security.AuthoritiesConstants;
import com.ntd.unipassau.codeannotation.web.rest.errors.NotFoundException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Collection;
import java.util.Set;
import java.util.stream.Collectors;

@Tag(name = "Prolific Controller")
@RestController
@Validated
public class ProlificController {
    private final static String COMPLETE_URL = "https://app.prolific.co/submissions/complete";
    private final DatasetRepository datasetRepository;
    private final RaterRepository raterRepository;

    @Autowired
    public ProlificController(
            DatasetRepository datasetRepository,
            RaterRepository raterRepository) {
        this.datasetRepository = datasetRepository;
        this.raterRepository = raterRepository;
    }

    @Operation(summary = "Complete rating in Prolific")
    @GetMapping("/v1/datasets/{datasetId}/prolific-completion")
    @Secured({AuthoritiesConstants.RATER})
    public String prolificCompletion(@PathVariable Long datasetId) {
        Dataset dataset = datasetRepository.findById(datasetId)
                .orElseThrow(() -> new NotFoundException(
                        "Could not find dataset by id: " + datasetId, "pathVars", "datasetId"));
        ProlificPropsParser prolificPropsParser = new ProlificPropsParser();
        ProlificProps prolificProps = prolificPropsParser.extractProlificProps(dataset.getConfiguration())
                .orElseThrow(() -> new RuntimeException("Invalid prolific configuration of dataset " + datasetId));
        return UriComponentsBuilder.fromHttpUrl(COMPLETE_URL)
                .queryParam("cc", prolificProps.getCompleteCode())
                .build()
                .toUri()
                .toString();
    }

    @Operation(summary = "List Prolific submissions")
    @GetMapping("/v1/datasets/{datasetId}/prolific-submissions")
    @Secured({AuthoritiesConstants.USER})
    @Transactional(readOnly = true)
    public Collection<SubmissionDTO> listSubmissions(@PathVariable Long datasetId) {
        Dataset dataset = datasetRepository.findById(datasetId)
                .orElseThrow(() -> new NotFoundException(
                        "Could not find dataset by id: " + datasetId, "pathVars", "datasetId"));

        Set<String> raterExternalIDs = raterRepository.findAllRatersByDatasetId(datasetId)
                .stream()
                .map(Rater::getExternalId)
                .collect(Collectors.toSet());

        ProlificPropsParser prolificPropsParser = new ProlificPropsParser();
        ProlificProps prolificProps = prolificPropsParser.extractProlificProps(dataset.getConfiguration())
                .orElseThrow(() -> new RuntimeException("Invalid prolific configuration of dataset " + datasetId));
        ProlificClient prolificClient = new HttpProlificClient(prolificProps);
        try {
            Collection<SubmissionDTO> submissions = prolificClient.listSubmissions()
                    .getResults();

            return submissions.stream()
                    .filter(s -> raterExternalIDs.contains(s.getParticipantId()))
                    .toList();
        } catch (WebClientResponseException e) {
            throw new RuntimeException("Failed to fetch prolific submissions", e);
        }
    }
}
