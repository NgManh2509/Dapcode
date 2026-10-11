package com.dapcode.backend_core.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecentSubmissionDto {
    private String id;
    private String username;
    private String userAvatar;
    private String problemTitle;
    private String problemSlug;
    private String status;
    private int languageId;
    private Double totalRuntimeMs;
    private String submittedAt;
}