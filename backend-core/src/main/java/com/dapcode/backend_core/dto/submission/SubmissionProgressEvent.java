package com.dapcode.backend_core.dto.submission;

import java.util.UUID;

import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionProgressEvent {
    private UUID submissionId;
    private int currentTest;
    private int totalTests;
    private String status;
    private Double runtimeMs;
    private Integer memoryKb;
    private String message;
}
