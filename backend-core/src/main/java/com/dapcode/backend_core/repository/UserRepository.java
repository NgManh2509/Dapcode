package com.dapcode.backend_core.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.dapcode.backend_core.entity.Users;

public interface UserRepository extends JpaRepository<Users, UUID> {
    Optional<Users> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<Users> findByUsername(String username);

    boolean existsByUsername(String username);

    @Query("""
                SELECT u FROM Users u
                WHERE (cast(:search as String) IS NULL
                       OR LOWER(u.username) LIKE LOWER(CONCAT('%', cast(:search as String), '%'))
                       OR LOWER(u.email) LIKE LOWER(CONCAT('%', cast(:search as String), '%')))
                  AND (cast(:role as String) IS NULL OR u.role = cast(:role as String))
                  AND (:isActive IS NULL OR u.isActive = :isActive)
                ORDER BY u.createdAt DESC
            """)
    Page<Users> findUsersWithFilters(
            @Param("search") String search,
            @Param("role") String role,
            @Param("isActive") Boolean isActive,
            Pageable pageable);

    long countByIsActive(boolean isActive);
}
