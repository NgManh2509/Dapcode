package com.dapcode.backend_core.controller.admin;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dapcode.backend_core.common.ApiResponse;
import com.dapcode.backend_core.dto.admin.AdminDashboardStatsResponse;
import com.dapcode.backend_core.service.dashboard.AdminDashboardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final AdminDashboardService adminDashboardService;

    @GetMapping("/stats")
    public ApiResponse<AdminDashboardStatsResponse> getDashboardStats() {
        AdminDashboardStatsResponse stats = adminDashboardService.getDashboardStats();
        return ApiResponse.success(stats);
    }
}
