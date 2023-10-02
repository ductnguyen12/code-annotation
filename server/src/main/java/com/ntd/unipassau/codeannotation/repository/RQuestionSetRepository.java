package com.ntd.unipassau.codeannotation.repository;

import com.ntd.unipassau.codeannotation.domain.rquestion.RQuestionSet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;

@Repository
public interface RQuestionSetRepository extends JpaRepository<RQuestionSet, Long> {
    @Query("FROM RQuestionSet qs LEFT JOIN FETCH qs.questions q ORDER BY qs.priority")
    Collection<RQuestionSet> findAllFetchQuestions();
}
