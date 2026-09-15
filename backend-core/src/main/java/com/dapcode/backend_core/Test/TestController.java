package com.dapcode.backend_core.Test;

import com.dapcode.backend_core.common.ApiResponse;
import com.dapcode.backend_core.common.ErrorCode;
import com.dapcode.backend_core.exception.AppException;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/success")
    public ApiResponse<List<String>> testSuccess() {
        return ApiResponse.success(List.of("Two Sum", "Valid Parentheses", "Reverse Linked List"));
    }

    @GetMapping("/error")
    public ApiResponse<Void> testError() {
        throw new AppException(ErrorCode.PROBLEM_NOT_FOUND);
    }
}
