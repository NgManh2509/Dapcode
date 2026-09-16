package com.dapcode.backend_core.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dapcode.backend_core.entity.Users;

public interface UserRepository extends JpaRepository<Users, UUID> {
    Optional<Users> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<Users> findByUsername(String username);

    boolean existsByUsername(String username);
}
