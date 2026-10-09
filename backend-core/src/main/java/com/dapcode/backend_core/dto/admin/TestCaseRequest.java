package com.dapcode.backend_core.dto.admin;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TestCaseRequest {
    @NotBlank(message = "Dữ liệu đầu vào (input) không được để trống")
    private String inputData;

    @NotBlank(message = "Kết quả kỳ vọng (output) không được để trống")
    private String expectedOutput;

    @Builder.Default
    private boolean isHidden = false;
}
