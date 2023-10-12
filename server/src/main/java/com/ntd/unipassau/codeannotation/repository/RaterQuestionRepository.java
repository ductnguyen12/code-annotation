package com.ntd.unipassau.codeannotation.repository;

import com.ntd.unipassau.codeannotation.domain.rater.RaterQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;

@Repository
public interface RaterQuestionRepository extends JpaRepository<RaterQuestion, Long> {
    @Query("FROM RaterQuestion q JOIN FETCH q.questionSet")
    Collection<RaterQuestion> findAllFetchQuestionSet();
}
