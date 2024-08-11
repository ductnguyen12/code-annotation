package com.ntd.unipassau.codeannotation.repository;

import com.ntd.unipassau.codeannotation.domain.rater.RaterAction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RaterActionRepository extends JpaRepository<RaterAction, Long> {
    @Query("FROM RaterAction ra JOIN FETCH ra.raterDataset rd JOIN FETCH rd.rater " +
            "WHERE ra.datasetId = :datasetId " +
            "ORDER BY ra.createdDate DESC")
    List<RaterAction> findAllFetchRaterByDatasetId(Long datasetId);
}
