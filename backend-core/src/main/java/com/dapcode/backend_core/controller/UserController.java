package com.dapcode.backend_core.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dapcode.backend_core.common.ApiResponse;
import com.dapcode.backend_core.common.ErrorCode;
import com.dapcode.backend_core.dto.auth.UserSummaryDto;
import com.dapcode.backend_core.entity.Users;
import com.dapcode.backend_core.exception.AppException;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    @GetMapping("/me")
    public ApiResponse<UserSummaryDto> getCurrentUser(@AuthenticationPrincipal Users currentUser) {
        if (currentUser == null) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        UserSummaryDto res = UserSummaryDto.builder().id(currentUser.getId()).username(currentUser.getUsername())
                .email(currentUser.getEmail()).avatarUrl(currentUser.getAvatarUrl()).role(currentUser.getRole())
                .xp(currentUser.getXp()).streakCount(currentUser.getStreakCount()).build();
        return ApiResponse.success(res);
    }
}
