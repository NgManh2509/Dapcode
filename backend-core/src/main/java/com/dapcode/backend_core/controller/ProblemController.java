package com.dapcode.backend_core.controller;

import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dapcode.backend_core.common.ApiResponse;
import com.dapcode.backend_core.dto.common.PageResponse;
import com.dapcode.backend_core.dto.problem.ProblemDetailResponse;
import com.dapcode.backend_core.dto.problem.ProblemSummaryResponse;
import com.dapcode.backend_core.service.problem.ProblemService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/problems")
@RequiredArgsConstructor
public class ProblemController {

    private final ProblemService problemService;

    @GetMapping
    public ApiResponse<PageResponse<ProblemSummaryResponse>> getProblems(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) String search,
            @PageableDefault(size = 20) Pageable pageable) {

        PageResponse<ProblemSummaryResponse> response = problemService.getProblems(
                category, difficulty, search, pageable);
        return ApiResponse.success(response);
    }

    @GetMapping("/{slug}")
    public ApiResponse<ProblemDetailResponse> getProblemBySlug(@PathVariable String slug) {
        ProblemDetailResponse response = problemService.getProblemBySlug(slug);
        return ApiResponse.success(response);
    }
}
