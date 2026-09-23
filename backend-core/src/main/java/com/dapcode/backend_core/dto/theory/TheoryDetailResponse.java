package com.dapcode.backend_core.dto.theory;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TheoryDetailResponse {
    private UUID id;
    private String slug;
    private String title;
    private String category;
    private String summary;
    private String contentMarkdown;
    private int orderIndex;
}
