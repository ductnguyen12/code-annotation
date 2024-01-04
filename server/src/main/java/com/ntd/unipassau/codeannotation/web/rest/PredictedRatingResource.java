package com.ntd.unipassau.codeannotation.web.rest;

import com.ntd.unipassau.codeannotation.security.AuthoritiesConstants;
import com.ntd.unipassau.codeannotation.service.PredictedRatingService;
import com.ntd.unipassau.codeannotation.web.rest.vm.PredictedRatingVM;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "Predicted Rating Resource")
@RestController
public class PredictedRatingResource {
    private final PredictedRatingService pRatingService;

    @Autowired
    public PredictedRatingResource(
            PredictedRatingService pRatingService) {
        this.pRatingService = pRatingService;
    }

    @Operation(summary = "Get predicted ratings of a dataset")
    @GetMapping("/v1/datasets/{datasetId}/predicted-ratings")
    @Secured({AuthoritiesConstants.USER})
    public List<PredictedRatingVM> listRatings(@PathVariable Long datasetId, Sort sort) {
        return pRatingService.listDatasetRatings(datasetId, sort);
    }
}
