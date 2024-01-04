package com.ntd.unipassau.codeannotation.service;

import com.ntd.unipassau.codeannotation.domain.prediction.PredictedRating;
import com.ntd.unipassau.codeannotation.domain.prediction.PredictionTarget;
import com.ntd.unipassau.codeannotation.mapper.ModelMapper;
import com.ntd.unipassau.codeannotation.repository.PredictedRatingRepository;
import com.ntd.unipassau.codeannotation.web.rest.vm.PredictedRatingVM;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PredictedRatingService {
    private final PredictedRatingRepository pRatingRepository;
    private final ModelMapper modelMapper;

    @Autowired
    public PredictedRatingService(
            PredictedRatingRepository pRatingRepository,
            ModelMapper modelMapper) {
        this.pRatingRepository = pRatingRepository;
        this.modelMapper = modelMapper;
    }

    @Transactional(readOnly = true)
    public Page<PredictedRatingVM> listRatings(Long targetId, PredictionTarget targetType, Pageable pageable) {
        Page<PredictedRating> pRatingPage = pRatingRepository.findAllByExecutionTarget(targetId, targetType, pageable);
        return new PageImpl<>(
                pRatingPage.get().map(modelMapper::toPRatingVM).toList(),
                pageable,
                pRatingPage.getTotalElements());
    }

    @Transactional(readOnly = true)
    public List<PredictedRatingVM> listDatasetRatings(Long datasetId, Sort sort) {
        return listRatings(datasetId, PredictionTarget.DATASET, Pageable.unpaged(sort))
                .getContent();
    }
}
