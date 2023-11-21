package com.ntd.unipassau.codeannotation.repository;

import com.ntd.unipassau.codeannotation.domain.question.QuestionSet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuestionSetRepository extends JpaRepository<QuestionSet, Long> {
}
