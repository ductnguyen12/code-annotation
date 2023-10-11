package com.ntd.unipassau.codeannotation.repository;

import com.ntd.unipassau.codeannotation.domain.dataset.SnippetQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SnippetQuestionRepository extends JpaRepository<SnippetQuestion, Long> {
}
