package com.ntd.unipassau.codeannotation.repository;

import com.ntd.unipassau.codeannotation.domain.rquestion.RSolution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.UUID;

@Repository
public interface RSolutionRepository extends JpaRepository<RSolution, RSolution.RSolutionId> {
    @Query("FROM RSolution s JOIN FETCH s.rater r JOIN FETCH s.question q WHERE r.id = :raterId")
    Collection<RSolution> findSolutionsByRater(UUID raterId);

    @Query("DELETE FROM RSolution s WHERE s.id in " +
            "(SELECT s2.id FROM RSolution s2 JOIN s2.rater r WHERE r.id = :raterId)")
    @Modifying
    void deleteByRaterId(UUID raterId);
}
