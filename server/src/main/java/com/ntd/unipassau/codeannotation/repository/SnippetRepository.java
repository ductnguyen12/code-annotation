package com.ntd.unipassau.codeannotation.repository;

import com.ntd.unipassau.codeannotation.domain.Snippet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;

@Repository
public interface SnippetRepository extends JpaRepository<Snippet, Long> {
    @Query("FROM Snippet s LEFT JOIN FETCH s.rate r " +
            "LEFT JOIN FETCH r.answers " +
            "LEFT JOIN FETCH s.questions q " +
            "LEFT JOIN FETCH q.answers qa " +
            "INNER JOIN FETCH s.dataset d " +
            "WHERE d.id = :datasetId")
    Collection<Snippet> findAllByDatasetId(Long datasetId);
}
