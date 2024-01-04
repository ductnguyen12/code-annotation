package com.ntd.unipassau.codeannotation.repository;

import com.ntd.unipassau.codeannotation.domain.prediction.PredictedRating;
import com.ntd.unipassau.codeannotation.domain.prediction.PredictionTarget;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;

@Repository
public interface PredictedRatingRepository extends JpaRepository<PredictedRating, PredictedRating.PRatingId> {
    @Query("FROM PredictedRating pr " +
            "INNER JOIN FETCH pr.execution ex " +
            "WHERE ex.targetId = :targetId AND ex.targetType = :targetType")
    Page<PredictedRating> findAllByExecutionTarget(Long targetId, PredictionTarget targetType, Pageable pageable);

    @Modifying
    @Query("DELETE FROM PredictedRating pr WHERE pr.id.snippetId in :snippetIds")
    void deleteAllBySnippets(Collection<Long> snippetIds);
}
