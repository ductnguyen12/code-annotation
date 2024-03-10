package com.ntd.unipassau.codeannotation.web.rest;

import com.ntd.unipassau.codeannotation.domain.dataset.Dataset;
import com.ntd.unipassau.codeannotation.security.AuthoritiesConstants;
import com.ntd.unipassau.codeannotation.service.DatasetService;
import com.ntd.unipassau.codeannotation.service.RaterMgmtService;
import com.ntd.unipassau.codeannotation.service.RaterMgmtServiceFactory;
import com.ntd.unipassau.codeannotation.web.rest.errors.NotFoundException;
import com.ntd.unipassau.codeannotation.web.rest.vm.SubmissionVM;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;

@Tag(name = "Submission Resource")
@RestController
public class SubmissionResource {
    private final DatasetService datasetService;
    private final RaterMgmtServiceFactory raterMgmtServiceFactory;

    @Autowired
    public SubmissionResource(
            DatasetService datasetService,
            RaterMgmtServiceFactory raterMgmtServiceFactory) {
        this.datasetService = datasetService;
        this.raterMgmtServiceFactory = raterMgmtServiceFactory;
    }

    @Operation(summary = "Get all submissions")
    @GetMapping("/v1/datasets/{datasetId}/submissions")
    @Secured({AuthoritiesConstants.USER})
    public Collection<SubmissionVM> getSubmissions(@PathVariable Long datasetId) {
        Dataset dataset = datasetService.getById(datasetId)
                .orElseThrow(() -> new NotFoundException(
                        "Could not find dataset by id: " + datasetId, "pathVars", "datasetId"));
        RaterMgmtService raterMgmtService = raterMgmtServiceFactory.create(dataset);
        return raterMgmtService.listSubmissions(dataset);
    }
}
