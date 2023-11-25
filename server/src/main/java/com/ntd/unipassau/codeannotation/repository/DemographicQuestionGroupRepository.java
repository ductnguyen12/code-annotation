package com.ntd.unipassau.codeannotation.repository;

import com.ntd.unipassau.codeannotation.domain.rater.DemographicQuestionGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.Set;

@Repository
public interface DemographicQuestionGroupRepository extends JpaRepository<DemographicQuestionGroup, Long> {
    @Query("FROM DemographicQuestionGroup dqg " +
            "LEFT JOIN FETCH dqg.questions q " +
            "LEFT JOIN dqg.datasets d " +
            "WHERE :datasetId IS NULL OR d.id = :datasetId " +
            "ORDER BY dqg.priority")
    Collection<DemographicQuestionGroup> findAllFetchQuestions(Long datasetId);

    @Query("FROM DemographicQuestionGroup dqg " +
            "LEFT JOIN FETCH dqg.datasets d " +
            "WHERE dqg.id IN :ids")
    Set<DemographicQuestionGroup> findAllFetchDatasetsByIds(Collection<Long> ids);

    @Query("FROM DemographicQuestionGroup dqg " +
            "INNER JOIN FETCH dqg.datasets d " +
            "WHERE d.id = :datasetId")
    Set<DemographicQuestionGroup> findAllFetchDataset(Long datasetId);
}
