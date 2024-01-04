package com.ntd.unipassau.codeannotation.repository;

import com.ntd.unipassau.codeannotation.domain.prediction.ModelExecution;
import com.ntd.unipassau.codeannotation.domain.prediction.PredictionTarget;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ModelExecutionRepository extends JpaRepository<ModelExecution, UUID> {
    @Query("FROM ModelExecution e WHERE " +
            "(:targetId IS NULL OR :targetId = e.targetId) AND " +
            "(:targetType IS NULL OR :targetType = e.targetType) AND " +
            "(:modelId IS NULL OR :modelId = e.modelId)")
    Page<ModelExecution> findAll(Long targetId, PredictionTarget targetType, Long modelId, Pageable pageable);
}
