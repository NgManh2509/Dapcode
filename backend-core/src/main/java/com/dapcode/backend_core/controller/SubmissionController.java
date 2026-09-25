package com.dapcode.backend_core.controller;

import java.util.UUID;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dapcode.backend_core.common.ApiResponse;
import com.dapcode.backend_core.dto.submission.SubmissionDetailResponse;
import com.dapcode.backend_core.dto.submission.SubmissionResponse;
import com.dapcode.backend_core.dto.submission.SubmitCodeRequest;
import com.dapcode.backend_core.entity.Users;
import com.dapcode.backend_core.service.submission.SubmissionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/v1/submissions")
@RequiredArgsConstructor
public class SubmissionController {

    private final SubmissionService submissionService;

    @PostMapping
    public ApiResponse<SubmissionResponse> submitCode(@AuthenticationPrincipal Users currUser,
            @Valid @RequestBody SubmitCodeRequest req) {
        if (currUser != null) {
            req.setUserId(currUser.getId());
        }
        SubmissionResponse res = submissionService.submitAndEvaluate(req);
        return ApiResponse.success(res);

    }

    @GetMapping("/{id}")
    public ApiResponse<SubmissionDetailResponse> getSubmissionById(@PathVariable UUID id,
            @AuthenticationPrincipal Users currUser) {
        SubmissionDetailResponse res = submissionService.getSubmissionById(id, currUser);
        return ApiResponse.success(res);
    }

}
