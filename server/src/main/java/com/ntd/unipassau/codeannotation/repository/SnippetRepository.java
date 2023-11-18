package com.ntd.unipassau.codeannotation.repository;

import com.ntd.unipassau.codeannotation.domain.dataset.Snippet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.Optional;

@Repository
public interface SnippetRepository extends JpaRepository<Snippet, Long> {
    @Query("FROM Snippet s LEFT JOIN FETCH s.rates r " +
            "LEFT JOIN FETCH r.rater " +
            "LEFT JOIN FETCH s.questions q " +
            "LEFT JOIN FETCH q.solutions " +
            "INNER JOIN FETCH s.dataset d " +
            "WHERE d.id = :datasetId " +
            "ORDER BY s.id ASC")
    Collection<Snippet> findAllByDatasetId(Long datasetId);

    @Query("FROM Snippet s " +
            "LEFT JOIN FETCH s.questions q " +
            "WHERE s.id = :snippetId")
    Optional<Snippet> findFetchQuestionsById(Long snippetId);
}
