package com.dapcode.backend_core.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dapcode.backend_core.common.ApiResponse;
import com.dapcode.backend_core.dto.theory.TheoryDetailResponse;
import com.dapcode.backend_core.dto.theory.TheorySummaryResponse;
import com.dapcode.backend_core.service.theory.TheoryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/theories")
@RequiredArgsConstructor
public class TheoryController {
    private final TheoryService theoryService;

    @GetMapping
    public ApiResponse<List<TheorySummaryResponse>> getTheories(@RequestParam(required = false) String category) {
        List<TheorySummaryResponse> response = theoryService.getTheories(category);
        return ApiResponse.success(response);
    }

    @GetMapping("/categories")
    public ApiResponse<List<String>> getCategories() {
        List<String> categories = theoryService.getCategories();
        return ApiResponse.success(categories);
    }

    @GetMapping("/{slug}")
    public ApiResponse<TheoryDetailResponse> getTheoryBySlug(@PathVariable String slug) {
        TheoryDetailResponse response = theoryService.getTheoryBySlug(slug);
        return ApiResponse.success(response);
    }
}
