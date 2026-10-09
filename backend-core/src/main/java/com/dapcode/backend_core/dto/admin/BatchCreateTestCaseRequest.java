package com.dapcode.backend_core.dto.admin;

import java.util.List;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BatchCreateTestCaseRequest {

    @NotEmpty(message = "Danh sách test case không được để trống")
    @Valid
    private List<TestCaseRequest> testCases;
}
