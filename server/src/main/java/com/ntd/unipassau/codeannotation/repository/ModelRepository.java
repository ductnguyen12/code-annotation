package com.ntd.unipassau.codeannotation.repository;

import com.ntd.unipassau.codeannotation.domain.prediction.Model;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ModelRepository extends JpaRepository<Model, Long> {
}
