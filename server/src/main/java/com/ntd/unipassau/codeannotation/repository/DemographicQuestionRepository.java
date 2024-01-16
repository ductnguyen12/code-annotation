package com.ntd.unipassau.codeannotation.repository;

import com.ntd.unipassau.codeannotation.domain.rater.DemographicQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;

@Repository
public interface DemographicQuestionRepository extends JpaRepository<DemographicQuestion, Long> {
    @Query("FROM DemographicQuestion q " +
            "LEFT JOIN FETCH q.subQuestions " +
            "LEFT JOIN FETCH q.parentQuestion " +
            "LEFT JOIN FETCH q.questionSets qs " +
            "WHERE :datasetId IS NULL OR qs.id in (" +
            "SELECT dqg.id FROM DemographicQuestionGroup dqg " +
            "JOIN dqg.datasets d WHERE d.id = :datasetId" +
            ") ORDER BY q.id"
    )
    Collection<DemographicQuestion> findAllFetchGroup(Long datasetId);
}
