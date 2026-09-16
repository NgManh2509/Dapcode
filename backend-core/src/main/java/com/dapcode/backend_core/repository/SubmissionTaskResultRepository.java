package com.dapcode.backend_core.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dapcode.backend_core.entity.SubmissionTaskResult;

public interface SubmissionTaskResultRepository extends JpaRepository<SubmissionTaskResult, UUID> {
    List<SubmissionTaskResult> findBySubmissionId(UUID submissionId);
}
