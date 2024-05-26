package com.ntd.unipassau.codeannotation.repository;

import com.ntd.unipassau.codeannotation.domain.rater.RaterDataset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;

@Repository
public interface RaterDatasetRepository
        extends JpaRepository<RaterDataset, RaterDataset.RaterDatasetId> {
    @Modifying
    @Transactional
    @Query("UPDATE RaterDataset rd SET rd.status = :status WHERE rd.id = :id")
    void updateStatusById(RaterDataset.RaterDatasetId id, String status);

    @Query("FROM RaterDataset rd INNER JOIN FETCH rd.rater r WHERE rd.id.datasetId = :datasetId")
    Collection<RaterDataset> findAllByDatasetId(Long datasetId);
}
