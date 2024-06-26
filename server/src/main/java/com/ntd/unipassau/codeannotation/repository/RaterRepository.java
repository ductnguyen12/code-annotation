package com.ntd.unipassau.codeannotation.repository;

import com.ntd.unipassau.codeannotation.domain.rater.Rater;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RaterRepository extends JpaRepository<Rater, UUID> {
    Optional<Rater> findByUserId(UUID userId);

    @Query("FROM Rater r WHERE r.externalId = :externalId AND r.externalSystem = :externalSystem")
    Optional<Rater> findByExternalInfo(String externalId, String externalSystem);

    @Query("FROM Rater r LEFT JOIN FETCH r.solutions s JOIN FETCH s.question q")
    Collection<Rater> findAllFetchSolutions();

    @Query("FROM Rater r LEFT JOIN FETCH r.solutions s JOIN FETCH s.question q WHERE r.id = :raterId")
    Optional<Rater> findByIdFetchSolutions(UUID raterId);

    @Query("FROM Rater r JOIN r.raterDatasets d WHERE d.id.datasetId = :datasetId")
    Collection<Rater> findAllRatersByDatasetId(Long datasetId);
}
