package com.dapcode.backend_core.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dapcode.backend_core.ai.AiHintRequest;
import com.dapcode.backend_core.ai.AiHintResponse;
import com.dapcode.backend_core.ai.AiServiceClient;
import com.dapcode.backend_core.common.ApiResponse;
import com.dapcode.backend_core.entity.Users;

import org.springframework.web.bind.annotation.RequestBody;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/ai")
@Slf4j
@RequiredArgsConstructor
public class AiController {
    private final AiServiceClient aiServiceClient;

    @PostMapping("/hint")
    public ApiResponse<AiHintResponse> getHint(@AuthenticationPrincipal Users currUser,
            @Valid @RequestBody AiHintRequest req) {
        log.info("User id={} xin gợi ý bài toán: problemSlug={}, hintLevel={}",
                currUser != null ? currUser.getId() : "anonymous",
                req.getProblemSlug(),
                req.getHintLevel());

        AiHintResponse res = aiServiceClient.getHint(req);
        return ApiResponse.success(res);
    }
}
