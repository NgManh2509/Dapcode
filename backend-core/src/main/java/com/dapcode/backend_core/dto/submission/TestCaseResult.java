package com.dapcode.backend_core.dto.submission;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TestCaseResult {

    private UUID testCaseId;

    private String status;

    private Double runtimeMs;

    private Integer memoryKb;

    private boolean isHidden;

    private String inputData;

    private String expectedOutput;

    private String actualOutput;

    private String errMes;
}
