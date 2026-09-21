package com.dapcode.backend_core.dto.problem;

import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProblemSummaryResponse {
    private UUID id;
    private String slug;
    private String title;
    private String difficulty;
    private String category;
}
