package com.ntd.unipassau.codeannotation.repository;

import com.ntd.unipassau.codeannotation.domain.dataset.Dataset;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.Optional;

@Repository
public interface DatasetRepository extends JpaRepository<Dataset, Long> {
    @Query("SELECT d FROM Dataset d " +
            "LEFT JOIN FETCH d.snippets s " +
            "LEFT JOIN FETCH s.rates r " +
            "LEFT JOIN FETCH r.rater " +
            "LEFT JOIN FETCH s.questions q " +
            "LEFT JOIN FETCH q.solutions so " +
            "WHERE d.id = :datasetId")
    Optional<Dataset> findFetchAllById(Long datasetId);

    @Query("SELECT d FROM Dataset d " +
            "LEFT JOIN FETCH d.snippets s " +
            "WHERE d.id = :datasetId")
    Optional<Dataset> findFetchSnippetsById(Long datasetId);

    @Query("SELECT d FROM Dataset d " +
            "LEFT JOIN FETCH d.dQuestionGroups g " +
            "WHERE d.id in :ids")
    Collection<Dataset> findAllFetchDQGroups(Collection<Long> ids);

    @Query("SELECT d.id FROM Dataset d")
    Page<Long> findDatasetIdPage(Pageable pageable);
}
