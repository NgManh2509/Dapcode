package com.dapcode.backend_core.controller.admin;

import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dapcode.backend_core.common.ApiResponse;
import com.dapcode.backend_core.dto.admin.CreateProblemRequest;
import com.dapcode.backend_core.dto.admin.UpdateProblemRequest;
import com.dapcode.backend_core.dto.common.PageResponse;
import com.dapcode.backend_core.dto.problem.ProblemDetailResponse;
import com.dapcode.backend_core.dto.problem.ProblemSummaryResponse;
import com.dapcode.backend_core.service.problem.ProblemService;

import org.springframework.web.bind.annotation.RequestBody;
import jakarta.validation.Valid;

import java.util.UUID;

import org.springframework.data.domain.Pageable;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/admin/problems")
@RequiredArgsConstructor
public class AdminProblemController {
    private final ProblemService problemService;

    @GetMapping
    public ApiResponse<PageResponse<ProblemSummaryResponse>> getProblems(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean isPublished,
            @PageableDefault(size = 20) Pageable pageable) {
        PageResponse<ProblemSummaryResponse> res = problemService.getAdminProblems(category, difficulty, search,
                isPublished, pageable);
        return ApiResponse.success(res);
    }

    @PostMapping
    public ApiResponse<ProblemDetailResponse> createProblem(@Valid @RequestBody CreateProblemRequest req) {
        ProblemDetailResponse res = problemService.createProblem(req);
        return ApiResponse.success(res);
    }

    @PutMapping("/{id}")
    public ApiResponse<ProblemDetailResponse> updateProblem(@PathVariable UUID id,
            @Valid @RequestBody UpdateProblemRequest req) {
        ProblemDetailResponse res = problemService.updateProblem(id, req);
        return ApiResponse.success(res);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteProblem(@PathVariable UUID id) {
        problemService.deleteProblem(id);
        return ApiResponse.success("Đã xóa bài tập thành công ");
    }

}
