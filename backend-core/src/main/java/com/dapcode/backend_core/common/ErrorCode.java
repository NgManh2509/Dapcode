package com.dapcode.backend_core.common;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Lỗi hệ thống không xác định", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_REQUEST(1001, "Dữ liệu yêu cầu không hợp lệ", HttpStatus.BAD_REQUEST),
    UNAUTHENTICATED(1002, "Chưa xác thực danh tính", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1003, "Bạn không có quyền thực hiện thao tác này", HttpStatus.FORBIDDEN),
    USER_NOT_FOUND(1004, "Không tìm thấy người dùng", HttpStatus.NOT_FOUND),
    PROBLEM_NOT_FOUND(1005, "Không tìm thấy bài tập", HttpStatus.NOT_FOUND),
    THEORY_NOT_FOUND(1006, "Không tìm thấy bài học lý thuyết", HttpStatus.NOT_FOUND),
    SUBMISSION_NOT_FOUND(1007, "Không tìm thấy bài nộp", HttpStatus.NOT_FOUND);

    private final int code;
    private final String message;
    private final HttpStatus httpStatus;

    ErrorCode(int code, String message, HttpStatus httpStatus) {
        this.code = code;
        this.message = message;
        this.httpStatus = httpStatus;
    }

}
