package com.dapcode.backend_core.service.problem;

import org.springframework.data.domain.Pageable;

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
}
