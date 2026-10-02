package com.dapcode.backend_core.dto.problem;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProblemDetailResponse {
    private UUID id;
    private String slug;
    private String title;
    private String difficulty;
    private String category;
    private String descriptionMarkdown;
    private int timeLimitMs;
    private int memoryLimitKb;
    private Map<String, String> starterCode;

    private List<PublicTestCaseDto> publicTestCases;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PublicTestCaseDto {
        private UUID id;
        private String inputData;
        private String expectedOutput;
    }
}
