package com.ntd.unipassau.codeannotation.service;

import com.ntd.unipassau.codeannotation.domain.rater.RaterAction;
import com.ntd.unipassau.codeannotation.domain.rater.RaterDataset;
import com.ntd.unipassau.codeannotation.mapper.RaterActionMapper;
import com.ntd.unipassau.codeannotation.repository.RaterActionRepository;
import com.ntd.unipassau.codeannotation.repository.RaterDatasetRepository;
import com.ntd.unipassau.codeannotation.web.rest.vm.RaterActionVM;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class RaterActionService {
    private final RaterActionMapper raMapper;
    private final RaterActionRepository raRepository;
    private final RaterDatasetRepository rdRepository;

    @Autowired
    public RaterActionService(
            RaterActionMapper raMapper,
            RaterActionRepository raRepository,
            RaterDatasetRepository rdRepository) {
        this.raMapper = raMapper;
        this.raRepository = raRepository;
        this.rdRepository = rdRepository;
    }

    @Transactional
    public Optional<RaterActionVM> createRaterAction(RaterActionVM actionVM) {
        RaterDataset.RaterDatasetId rdId = new RaterDataset.RaterDatasetId();
        rdId.setRaterId(actionVM.getRaterId());
        rdId.setDatasetId(actionVM.getDatasetId());

        return rdRepository.findById(rdId)
                .map(raterDataset -> {
                    RaterAction raterAction = raMapper.toRaterAction(actionVM);
                    raterAction.setRaterDataset(raterDataset);
                    return raRepository.save(raterAction);
                })
                .map(raMapper::toRaterActionVM);
    }
}
