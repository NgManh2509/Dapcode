package com.dapcode.backend_core.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dapcode.backend_core.entity.TestCase;

public interface TestCaseRepository extends JpaRepository<TestCase, UUID> {
    List<TestCase> findBySubTaskId(UUID subtaskId);

    List<TestCase> findByProblemId(UUID problemId);

    List<TestCase> findByProblemIdAndIsHiddenFalse(UUID problemId);
}
