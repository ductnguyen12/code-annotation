package com.ntd.unipassau.codeannotation.repository;

import com.ntd.unipassau.codeannotation.domain.RateAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface RateAnswerRepository extends JpaRepository<RateAnswer, Long> {
    @Modifying
    @Query("DELETE FROM RateAnswer ra WHERE ra.id IN " +
            "(SELECT a.id FROM Answer a JOIN a.question q JOIN q.snippet s WHERE s.id = :snippetId)")
    void deleteAllBySnippet(Long snippetId);
}
