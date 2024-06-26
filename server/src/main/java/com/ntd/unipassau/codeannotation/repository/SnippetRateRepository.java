package com.ntd.unipassau.codeannotation.repository;

import com.ntd.unipassau.codeannotation.domain.rater.SnippetRate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SnippetRateRepository extends JpaRepository<SnippetRate, Long> {
    @Query("FROM SnippetRate sr WHERE sr.snippet.id = :snippetId AND sr.rater.id = :raterId")
    Optional<SnippetRate> findBySnippetAndRater(Long snippetId, UUID raterId);

    @Query("FROM SnippetRate sr INNER JOIN sr.snippet s " +
            "WHERE s.datasetId = :datasetId " +
            "AND s.correctRating IS NOT NULL AND sr.value != s.correctRating")
    Collection<SnippetRate> findIncorrectRatingsByDatasetId(Long datasetId);
}
