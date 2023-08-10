package com.ntd.unipassau.codeannotation.repository;

import com.ntd.unipassau.codeannotation.domain.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
}
