package com.ntd.unipassau.codeannotation.repository;

import com.ntd.unipassau.codeannotation.domain.rater.DemographicQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;

@Repository
public interface DemographicQuestionRepository extends JpaRepository<DemographicQuestion, Long> {
    @Query("FROM DemographicQuestion q LEFT JOIN FETCH q.questionSet")
    Collection<DemographicQuestion> findAllFetchQuestionSet();
}
