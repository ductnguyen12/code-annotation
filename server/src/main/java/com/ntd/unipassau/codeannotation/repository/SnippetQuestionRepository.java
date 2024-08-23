package com.ntd.unipassau.codeannotation.repository;

import com.ntd.unipassau.codeannotation.domain.dataset.SnippetQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SnippetQuestionRepository extends JpaRepository<SnippetQuestion, Long>,
        PatchingObjectRepository<Long> {
    default void updateSnippetQuestionFieldById(Long questionId, String field, Object value) {
        updateFieldById("SnippetQuestion", questionId, field, value);
    }
}
