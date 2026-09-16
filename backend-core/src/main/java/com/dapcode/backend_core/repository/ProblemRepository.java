package com.dapcode.backend_core.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dapcode.backend_core.entity.Problem;

public interface ProblemRepository extends JpaRepository<Problem, UUID> {
    Optional<Problem> findBySlug(String slug);

    boolean existsBySlug(String slug);

    List<Problem> findByDifficulty(String difficulty);
}
