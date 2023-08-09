package com.ntd.unipassau.codeannotation.repository;

import com.ntd.unipassau.codeannotation.domain.Answer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, Long> {
}
