package com.ntd.unipassau.codeannotation.repository;

import com.ntd.unipassau.codeannotation.domain.rater.Solution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.UUID;

@Repository
public interface SolutionRepository extends JpaRepository<Solution, Solution.SolutionId> {
    @Query("FROM Solution s JOIN FETCH s.rater r JOIN FETCH s.question q WHERE r.id = :raterId")
    Collection<Solution> findSolutionsByRater(UUID raterId);

    @Query("DELETE FROM Solution s WHERE s.id in (" +
            "SELECT s2.id FROM Solution s2 JOIN s2.rater r JOIN s2.question q " +
            "INNER JOIN DemographicQuestion dq ON q.id = dq.id " +
            "WHERE r.id = :raterId" +
            ")")
    @Modifying
    void deleteRaterSolutionsByRaterId(UUID raterId);

    @Query("DELETE FROM Solution s WHERE s.id.raterId = :raterId AND s.id in (" +
            "SELECT s2.id FROM Solution s2 JOIN s2.question q " +
            "INNER JOIN SnippetQuestion sq ON q.id = sq.id " +
            "WHERE sq.snippet.id = :snippetId" +
            ")")
    @Modifying
    void deleteSnippetSolutionsBySnippetId(UUID raterId, Long snippetId);
}
