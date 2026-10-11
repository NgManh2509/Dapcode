package com.dapcode.backend_core.controller.admin;

import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dapcode.backend_core.common.ApiResponse;
import com.dapcode.backend_core.dto.admin.AdminUserResponse;
import com.dapcode.backend_core.dto.admin.UpdateUserRoleRequest;
import com.dapcode.backend_core.dto.admin.UpdateUserStatusRequest;
import com.dapcode.backend_core.dto.common.PageResponse;
import com.dapcode.backend_core.entity.Users;
import com.dapcode.backend_core.service.user.AdminUserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/admin/users")
@RequiredArgsConstructor
public class AdminUserController {
    private final AdminUserService adminUserService;

    @GetMapping
    public ApiResponse<PageResponse<AdminUserResponse>> getUsers(@RequestParam(required = false) String search,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) Boolean isActive,
            @PageableDefault(size = 20) Pageable pageable) {
        PageResponse<AdminUserResponse> res = adminUserService.getUsers(search, role, isActive, pageable);
        return ApiResponse.success(res);
    }

    @GetMapping("/{id}")
    public ApiResponse<AdminUserResponse> getUserById(@PathVariable UUID id) {
        AdminUserResponse response = adminUserService.getUserById(id);
        return ApiResponse.success(response);
    }

    @PutMapping("/{id}/status")
    public ApiResponse<AdminUserResponse> updateUserStatus(
            @PathVariable UUID id,
            @RequestBody UpdateUserStatusRequest request,
            @AuthenticationPrincipal Users currentAdmin) {
        AdminUserResponse response = adminUserService.updateUserStatus(id, request, currentAdmin);
        return ApiResponse.success(response);
    }

    @PutMapping("/{id}/role")
    public ApiResponse<AdminUserResponse> updateUserRole(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateUserRoleRequest request,
            @AuthenticationPrincipal Users currentAdmin) {
        AdminUserResponse response = adminUserService.updateUserRole(id, request, currentAdmin);
        return ApiResponse.success(response);
    }
}
