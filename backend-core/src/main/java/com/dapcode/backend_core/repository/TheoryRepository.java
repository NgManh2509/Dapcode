package com.dapcode.backend_core.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Query;

import com.dapcode.backend_core.entity.Theories;

public interface TheoryRepository extends JpaRepository<Theories, UUID> {
    Optional<Theories> findBySlugAndIsPublishedTrue(String slug);

    boolean existsBySlug(String slug);

    @Query("""
                SELECT t FROM Theories t
                WHERE t.isPublished = true
                  AND (cast(:category as String) IS NULL OR LOWER(t.category) = LOWER(cast(:category as String)))
                ORDER BY t.category ASC, t.orderIndex ASC
            """)
    List<Theories> findPublishedTheories(@Param("category") String category);

    @Query("SELECT DISTINCT t.category FROM Theories t WHERE t.isPublished = true ORDER BY t.category ASC")
    List<String> findDistinctCategories();

}
