package com.ntd.unipassau.codeannotation.service;

import com.ntd.unipassau.codeannotation.domain.dataset.Dataset;
import com.ntd.unipassau.codeannotation.domain.rater.Solution;
import com.ntd.unipassau.codeannotation.web.rest.vm.SubmissionVM;

import java.util.Collection;

public interface RaterMgmtService {
    Collection<SubmissionVM> listSubmissions(Dataset dataset);

    Collection<Solution> getVerifiedSolutions(Collection<Solution> solutions);
}
