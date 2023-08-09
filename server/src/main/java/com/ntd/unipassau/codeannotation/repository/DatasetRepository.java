package com.ntd.unipassau.codeannotation.repository;

import com.ntd.unipassau.codeannotation.domain.Dataset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DatasetRepository extends JpaRepository<Dataset, Long> {
    @Query("SELECT d FROM Dataset d " +
            "LEFT JOIN FETCH d.snippets s " +
            "LEFT JOIN FETCH s.rate r " +
            "LEFT JOIN FETCH s.questions q " +
            "LEFT JOIN FETCH q.answers a " +
            "LEFT JOIN FETCH a.rateAnswer " +
            "WHERE d.id = :datasetId")
    Optional<Dataset> findFetchAllById(Long datasetId);
}
