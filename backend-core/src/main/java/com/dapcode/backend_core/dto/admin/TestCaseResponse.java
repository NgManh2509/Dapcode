package com.dapcode.backend_core.dto.admin;

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
public class TestCaseResponse {
    private UUID id;
    private UUID problemId;
    private String inputData;
    private String expectedOutput;
    private boolean isHidden;
    private Instant createdAt;
}
