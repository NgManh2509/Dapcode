package com.dapcode.backend_core.dto.submission;

import java.util.List;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubmissionResponse {
    private UUID submissionId;

    private String slug;
    private String status;

    private Integer maxMemoryKb;

    private int totalRuntimeMs;

    private int passedTestCases;

    private int xpEarned;

    private int currentStreak;

    private List<TestCaseResult> testCaseResults;

}
