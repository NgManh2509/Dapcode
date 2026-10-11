package com.dapcode.backend_core.controller.admin;

import java.util.List;
import java.util.UUID;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dapcode.backend_core.common.ApiResponse;
import com.dapcode.backend_core.dto.admin.CreateTheoryRequest;
import com.dapcode.backend_core.dto.admin.UpdateTheoryRequest;
import com.dapcode.backend_core.entity.Theories;
import com.dapcode.backend_core.service.theory.TheoryService;

import org.springframework.web.bind.annotation.RequestBody;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/admin/theories")
@RequiredArgsConstructor
public class AdminTheoryController {
    private final TheoryService theoryService;

    @GetMapping
    public ApiResponse<List<Theories>> getTheories(@RequestParam(required = false) String category) {
        List<Theories> res = theoryService.getAdminTheories(category);
        return ApiResponse.success(res);
    }

    @GetMapping("/{id}")
    public ApiResponse<Theories> getTheoryById(@PathVariable UUID id) {
        Theories res = theoryService.getAdminTheoryById(id);
        return ApiResponse.success(res);
    }

    @PostMapping
    public ApiResponse<Theories> createTheory(@Valid @RequestBody CreateTheoryRequest req) {
        Theories res = theoryService.createTheory(req);
        return ApiResponse.success(res);
    }

    @PutMapping("/{id}")
    public ApiResponse<Theories> updateTheory(@PathVariable UUID id, @Valid @RequestBody UpdateTheoryRequest req) {
        Theories res = theoryService.updateTheory(id, req);
        return ApiResponse.success(res);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteTheory(@PathVariable UUID id) {
        theoryService.deleteTheory(id);
        return ApiResponse.success("Đã xóa bài giảng thành công");
    }

}
