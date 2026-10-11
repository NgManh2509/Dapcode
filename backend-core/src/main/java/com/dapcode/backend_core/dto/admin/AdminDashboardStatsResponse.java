package com.dapcode.backend_core.dto.admin;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminDashboardStatsResponse {
    private long totalUsers;
    private long activeUsers;
    private long bannedUsers;
    private long totalProblems;
    private long easyProblems;
    private long mediumProblems;
    private long hardProblems;
    private long totalSubmissions;
    private long totalDailySubmissions;
    private double acceptedRate;

    private List<DailySubmissionCount> submissionLast7Days;
    private List<RecentSubmissionDto> recentSubmission;
}
