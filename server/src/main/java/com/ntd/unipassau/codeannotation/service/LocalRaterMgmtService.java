package com.ntd.unipassau.codeannotation.service;

import com.ntd.unipassau.codeannotation.domain.dataset.Dataset;
import com.ntd.unipassau.codeannotation.domain.rater.RaterDataset;
import com.ntd.unipassau.codeannotation.domain.rater.Solution;
import com.ntd.unipassau.codeannotation.mapper.RaterMapper;
import com.ntd.unipassau.codeannotation.repository.RaterDatasetRepository;
import com.ntd.unipassau.codeannotation.web.rest.vm.SubmissionVM;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;

@Service
public class LocalRaterMgmtService implements RaterMgmtService {
    private final RaterDatasetRepository raterDatasetRepository;
    private final RaterMapper raterMapper;

    public LocalRaterMgmtService(
            RaterDatasetRepository raterDatasetRepository,
            RaterMapper raterMapper) {
        this.raterDatasetRepository = raterDatasetRepository;
        this.raterMapper = raterMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public Collection<SubmissionVM> listSubmissions(Dataset dataset) {
        Collection<RaterDataset> raterDatasets = raterDatasetRepository.findAllByDatasetId(dataset.getId());
        return raterDatasets.stream()
                .map(rd -> {
                    SubmissionVM submissionVM = new SubmissionVM();
                    BeanUtils.copyProperties(rd, submissionVM, "id", "rater");
                    submissionVM.setRater(raterMapper.toSimpleRaterVM(rd.getRater()));
                    return submissionVM;
                })
                .toList();
    }

    @Override
    public Collection<Solution> getVerifiedSolutions(Collection<Solution> solutions) {
        return solutions;
    }
}
