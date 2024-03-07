package com.ntd.unipassau.codeannotation.service;

import com.ntd.unipassau.codeannotation.domain.rater.Solution;

import java.util.Collection;

public interface RaterMgmtService {
    Collection<Solution> getVerifiedSolutions(Collection<Solution> solutions);
}
