package com.dapcode.backend_core.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dapcode.backend_core.entity.SubTask;

public interface SubTaskRepository extends JpaRepository<SubTask, UUID> {
    List<SubTask> findByProblemIdOrderByStepOrderAsc(UUID problemId);

    Optional<SubTask> findByProblemIdAndStepOrder(UUID problemId, int stepOrder);
}
