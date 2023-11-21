package com.ntd.unipassau.codeannotation.repository;

import com.ntd.unipassau.codeannotation.domain.rater.DemographicQuestionGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;

@Repository
public interface DemographicQuestionGroupRepository extends JpaRepository<DemographicQuestionGroup, Long> {
    @Query("FROM DemographicQuestionGroup dqg " +
            "LEFT JOIN FETCH dqg.questions q " +
            "LEFT JOIN dqg.datasets d " +
            "WHERE :datasetId IS NULL OR d.id = :datasetId " +
            "ORDER BY dqg.priority")
    Collection<DemographicQuestionGroup> findAllFetchQuestions(Long datasetId);
}
