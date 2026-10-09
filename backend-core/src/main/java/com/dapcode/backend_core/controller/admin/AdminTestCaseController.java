package com.dapcode.backend_core.controller.admin;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dapcode.backend_core.common.ApiResponse;
import com.dapcode.backend_core.dto.admin.BatchCreateTestCaseRequest;
import com.dapcode.backend_core.dto.admin.TestCaseRequest;
import com.dapcode.backend_core.dto.admin.TestCaseResponse;
import com.dapcode.backend_core.service.testcase.TestCaseService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.UUID;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminTestCaseController {
    private final TestCaseService testCaseService;

    @GetMapping("/problems/{problemId}/testcases")
    public ApiResponse<List<TestCaseResponse>> getTestCasesByProblemId(@PathVariable UUID problemId) {
        List<TestCaseResponse> res = testCaseService.getTestCasesByProblemId(problemId);
        return ApiResponse.success(res);
    }

    @PostMapping("/problems/{problemId}/testcases")
    public ApiResponse<TestCaseResponse> createTestCase(@PathVariable UUID problemId,
            @Valid @RequestBody TestCaseRequest req) {
        TestCaseResponse res = testCaseService.createTestCase(problemId, req);
        return ApiResponse.success(res);
    }

    @PostMapping("/problems/{problemId}/testcases/batch")
    public ApiResponse<List<TestCaseResponse>> createBatchTestCases(@PathVariable UUID problemId,
            @Valid @RequestBody BatchCreateTestCaseRequest req) {
        List<TestCaseResponse> res = testCaseService.createBatchTestCases(problemId, req);
        return ApiResponse.success(res);
    }

    @PutMapping("/testcases/{id}")
    public ApiResponse<TestCaseResponse> updateTestCase(
            @PathVariable UUID id,
            @Valid @RequestBody TestCaseRequest request) {
        TestCaseResponse response = testCaseService.updateTestCase(id, request);
        return ApiResponse.success(response);
    }

    @DeleteMapping("/testcases/{id}")
    public ApiResponse<String> deleteTestCase(@PathVariable UUID id) {
        testCaseService.deleteTestCase(id);
        return ApiResponse.success("Đã xóa test case thành công");
    }

}
