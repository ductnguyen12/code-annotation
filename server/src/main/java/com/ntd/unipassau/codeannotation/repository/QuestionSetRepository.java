package com.ntd.unipassau.codeannotation.repository;

import com.ntd.unipassau.codeannotation.domain.question.QuestionSet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;

@Repository
public interface QuestionSetRepository extends JpaRepository<QuestionSet, Long> {
    @Query("FROM QuestionSet qs LEFT JOIN FETCH qs.questions q ORDER BY qs.priority")
    Collection<QuestionSet> findAllFetchQuestions();
}
