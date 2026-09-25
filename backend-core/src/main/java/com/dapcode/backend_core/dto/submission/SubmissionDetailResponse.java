package com.dapcode.backend_core.dto.submission;

import java.time.Instant;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionDetailResponse {
    private UUID id;
    private String problemSlug;
    private String problemTitle;
    private String status;
    private String sourceCode;
    private int languageId;
    private Double totalRuntimeMs;
    private Integer maxMemoryKb;
    private Instant createdAt;
}
