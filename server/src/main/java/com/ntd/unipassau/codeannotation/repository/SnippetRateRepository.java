package com.ntd.unipassau.codeannotation.repository;

import com.ntd.unipassau.codeannotation.domain.rater.SnippetRate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Repository
public interface SnippetRateRepository extends JpaRepository<SnippetRate, Long> {
    @Query("FROM SnippetRate sr WHERE sr.snippet.id = :snippetId AND sr.rater.id = :raterId")
    Optional<SnippetRate> findBySnippetAndRater(Long snippetId, UUID raterId);

    @Query("SELECT sr.raterId, COUNT (*) " +
            "FROM SnippetRate sr INNER JOIN sr.snippet s " +
            "WHERE s.datasetId = :datasetId " +
            "AND s.correctRating IS NOT NULL " +
            "AND sr.value != s.correctRating " +
            "GROUP BY sr.raterId")
    List<List<Object>> internalCountIncorrectRatingsByDatasetId(Long datasetId);

    default Map<UUID, Long> countIncorrectRatingsByDatasetId(Long datasetId) {
        List<List<Object>> results = internalCountIncorrectRatingsByDatasetId(datasetId);
        return results.stream()
                .collect(Collectors.toMap(res -> (UUID) res.get(0), res -> (Long) res.get(1)));
    }
}
