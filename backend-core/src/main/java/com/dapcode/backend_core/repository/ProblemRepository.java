package com.dapcode.backend_core.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.dapcode.backend_core.entity.Problem;

public interface ProblemRepository extends JpaRepository<Problem, UUID> {
    Optional<Problem> findBySlug(String slug);

    boolean existsBySlug(String slug);

    List<Problem> findByDifficulty(String difficulty);

    @Query("""
        SELECT p FROM Problem p
        WHERE (cast(:category as String) IS NULL OR LOWER(p.category) = LOWER(cast(:category as String)))
          AND (cast(:difficulty as String) IS NULL OR LOWER(p.difficulty) = LOWER(cast(:difficulty as String)))
          AND (cast(:search as String) IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', cast(:search as String), '%'))
                                                OR LOWER(p.slug) LIKE LOWER(CONCAT('%', cast(:search as String), '%')))
    """)
    Page<Problem> findProblemsWithFilters(
            @Param("category") String category,
            @Param("difficulty") String difficulty,
            @Param("search") String search,
            Pageable pageable);
}
