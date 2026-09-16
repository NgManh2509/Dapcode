package com.dapcode.backend_core.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dapcode.backend_core.entity.Submission;

public interface SubmissionRepository extends JpaRepository<Submission, UUID> {
    List<Submission> findByUserIdOrderByCreatedAtDesc(UUID userId);

    List<Submission> findByUserIdAndProblemIdOrderByCreatedAtDesc(UUID userId, UUID problemId);
}
