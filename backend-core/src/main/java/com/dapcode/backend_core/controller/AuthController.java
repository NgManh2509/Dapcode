package com.dapcode.backend_core.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dapcode.backend_core.common.ApiResponse;
import com.dapcode.backend_core.dto.auth.AuthResponse;
import com.dapcode.backend_core.dto.auth.LoginGoogleRequest;
import com.dapcode.backend_core.service.auth.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/google")
    public ApiResponse<AuthResponse> loginWithGoogle(@Valid @RequestBody LoginGoogleRequest request) {
        AuthResponse response = authService.authenticateWithGoogle(request);
        return ApiResponse.success(response);
    }

    @PostMapping("/admin-login")
    public ApiResponse<AuthResponse> loginAdmin(@Valid @RequestBody com.dapcode.backend_core.dto.auth.AdminLoginRequest request) {
        AuthResponse response = authService.authenticateAdmin(request);
        return ApiResponse.success(response);
    }
}
