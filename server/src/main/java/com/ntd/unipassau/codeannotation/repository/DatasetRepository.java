package com.ntd.unipassau.codeannotation.repository;

import com.ntd.unipassau.codeannotation.domain.Dataset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DatasetRepository extends JpaRepository<Dataset, Long> {
}
