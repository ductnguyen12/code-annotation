package com.ntd.unipassau.codeannotation.integration.prolific;

import com.ntd.unipassau.codeannotation.domain.dataset.Dataset;
import com.ntd.unipassau.codeannotation.repository.DatasetRepository;
import com.ntd.unipassau.codeannotation.security.AuthoritiesConstants;
import com.ntd.unipassau.codeannotation.web.rest.errors.NotFoundException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

@Tag(name = "Prolific Controller")
@RestController
@Validated
public class ProlificController {
    private final static String COMPLETE_URL = "https://app.prolific.co/submissions/complete";
    private final DatasetRepository datasetRepository;

    @Autowired
    public ProlificController(DatasetRepository datasetRepository) {
        this.datasetRepository = datasetRepository;
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
}
