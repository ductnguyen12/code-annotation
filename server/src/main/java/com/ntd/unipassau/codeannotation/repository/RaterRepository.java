package com.ntd.unipassau.codeannotation.repository;

import com.ntd.unipassau.codeannotation.domain.Rater;
import com.ntd.unipassau.codeannotation.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RaterRepository extends JpaRepository<Rater, UUID> {
}
