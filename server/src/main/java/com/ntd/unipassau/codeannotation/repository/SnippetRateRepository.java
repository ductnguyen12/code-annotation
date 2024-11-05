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

    @Query("SELECT sr.raterId, " +
            "SUM(CASE WHEN sr.value != s.correctRating AND sr.value = sr2.value THEN 1 ELSE 0 END) " +
            "FROM SnippetRate sr INNER JOIN sr.snippet s " +
            "INNER JOIN SnippetRate sr2 ON sr.raterId = sr2.raterId INNER JOIN sr2.snippet s2 " +
            "WHERE s.datasetId = :datasetId AND s.correctRating IS NOT NULL " +
            "AND s2.datasetId = :datasetId AND s2.correctRating IS NULL " +
            "AND s.path = s2.path AND s.id != s2.id " +
            "GROUP BY sr.raterId")
    List<List<Object>> internalCountConsistentFailedAttentionCheckDatasetId(Long datasetId);

    /**
     * Count the number of failed attention check in which raters give the same rating
     * for both regular and attention check snippet.
     *
     * @param datasetId Dataset ID
     * @return a map between rater id and the number of failed attention check that are consistent.
     */
    default Map<UUID, Integer> countConsistentFailedAttentionCheckDatasetId(Long datasetId) {
        List<List<Object>> results = internalCountConsistentFailedAttentionCheckDatasetId(datasetId);
        return results.stream()
                .collect(Collectors.toMap(res -> (UUID) res.get(0), res -> ((Long) res.get(1)).intValue()));
    }
}
