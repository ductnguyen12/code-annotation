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

    @Query("SELECT sr.raterId, " +
            "SUM(CASE WHEN sr.value IS NOT NULL THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN s.correctRating IS NOT NULL AND sr.value = s.correctRating THEN 1 ELSE 0 END) " +
            "FROM SnippetRate sr INNER JOIN sr.snippet s " +
            "WHERE s.datasetId = :datasetId " +
            "GROUP BY sr.raterId")
    List<List<Object>> internalCountRatingsByDatasetId(Long datasetId);

    /**
     * Count the number of ratings and correct ratings of each rater for a given dataset.
     *
     * @param datasetId Dataset ID
     * @return a map between rater id and a pair in which the first element is the number of ratings
     * and second is number of correct ratings.
     */
    default Map<UUID, List<Long>> countCorrectRatingsByDatasetId(Long datasetId) {
        List<List<Object>> results = internalCountRatingsByDatasetId(datasetId);
        return results.stream()
                .collect(Collectors.toMap(res -> (UUID) res.get(0),
                        res -> res.subList(1, res.size())
                                .stream()
                                .map(x -> (Long) x)
                                .toList()
                ));
    }
}
