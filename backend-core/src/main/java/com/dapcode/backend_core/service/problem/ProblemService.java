package com.dapcode.backend_core.service.problem;

import java.util.UUID;

import org.springframework.data.domain.Pageable;

import com.dapcode.backend_core.dto.admin.CreateProblemRequest;
import com.dapcode.backend_core.dto.admin.UpdateProblemRequest;
import com.dapcode.backend_core.dto.common.PageResponse;
import com.dapcode.backend_core.dto.problem.ProblemDetailResponse;
import com.dapcode.backend_core.dto.problem.ProblemSummaryResponse;

public interface ProblemService {

    PageResponse<ProblemSummaryResponse> getProblems(
            String category,
            String difficulty,
            String search,
            Pageable pageable);

    ProblemDetailResponse getProblemBySlug(String slug);

    ProblemDetailResponse createProblem(CreateProblemRequest req);

    ProblemDetailResponse updateProblem(UUID id, UpdateProblemRequest req);

    void deleteProblem(UUID id);

    PageResponse<ProblemSummaryResponse> getAdminProblems(
            String category,
            String difficulty,
            String search,
            Boolean isPublished,
            Pageable pageable);
}
