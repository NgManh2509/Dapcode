package com.dapcode.backend_core.service.dashboard;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dapcode.backend_core.dto.admin.AdminDashboardStatsResponse;
import com.dapcode.backend_core.dto.admin.DailySubmissionCount;
import com.dapcode.backend_core.dto.admin.RecentSubmissionDto;
import com.dapcode.backend_core.entity.Submission;
import com.dapcode.backend_core.repository.ProblemRepository;
import com.dapcode.backend_core.repository.SubmissionRepository;
import com.dapcode.backend_core.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminDashboardServiceImpl implements AdminDashboardService {
    private final UserRepository userRepository;
    private final ProblemRepository problemRepository;
    private final SubmissionRepository submissionRepository;

    @Override
    @Transactional(readOnly = true)
    public AdminDashboardStatsResponse getDashboardStats() {
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.countByIsActive(true);
        long bannedUsers = userRepository.countByIsActive(false);
        long totalProblems = problemRepository.count();
        long easyProblems = problemRepository.countByDifficultyIgnoreCase("EASY");
        long mediumProblems = problemRepository.countByDifficultyIgnoreCase("MEDIUM");
        long hardProblems = problemRepository.countByDifficultyIgnoreCase("HARD");
        long totalSubmissions = submissionRepository.count();
        long acceptedSubmissions = submissionRepository.countByStatus("ACCEPTED");
        double acceptedRate = totalSubmissions > 0
                ? Math.round(((double) acceptedSubmissions / totalSubmissions) * 1000.0) / 10.0
                : 0.0;
        LocalDate today = LocalDate.now();
        LocalDate sevenDaysAgoDate = today.minusDays(6);
        Instant sevenDaysAgoInstant = sevenDaysAgoDate.atStartOfDay(ZoneId.systemDefault()).toInstant();
        List<Submission> recent7DaysSubmissions = submissionRepository
                .findByCreatedAtAfterOrderByCreatedAtAsc(sevenDaysAgoInstant);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        Map<String, Long> countByDate = recent7DaysSubmissions.stream()
                .collect(Collectors.groupingBy(
                        s -> formatter.format(s.getCreatedAt().atZone(ZoneId.systemDefault())),
                        Collectors.counting()));
        List<DailySubmissionCount> dailyCounts = new ArrayList<>();
        long totalDailySubmissions = 0;
        for (int i = 0; i < 7; i++) {
            LocalDate d = sevenDaysAgoDate.plusDays(i);
            String dateStr = d.format(formatter);
            long count = countByDate.getOrDefault(dateStr, 0L);
            dailyCounts.add(DailySubmissionCount.builder()
                    .date(dateStr)
                    .count(count)
                    .build());
            totalDailySubmissions += count;
        }
        List<Submission> top5 = submissionRepository.findTop5ByOrderByCreatedAtDesc();
        List<RecentSubmissionDto> recentSubmissions = top5.stream()
                .map(s -> RecentSubmissionDto.builder()
                        .id(s.getId() != null ? s.getId().toString() : null)
                        .username(s.getUser() != null ? s.getUser().getUsername() : "N/A")
                        .userAvatar(s.getUser() != null ? s.getUser().getAvatarUrl() : null)
                        .problemTitle(s.getProblem() != null ? s.getProblem().getTitle() : "N/A")
                        .problemSlug(s.getProblem() != null ? s.getProblem().getSlug() : "")
                        .status(s.getStatus())
                        .languageId(s.getLanguageId())
                        .totalRuntimeMs(s.getTotalRuntimeMs())
                        .submittedAt(s.getCreatedAt() != null ? s.getCreatedAt().toString() : null)
                        .build())
                .collect(Collectors.toList());
        return AdminDashboardStatsResponse.builder()
                .totalUsers(totalUsers)
                .activeUsers(activeUsers)
                .bannedUsers(bannedUsers)
                .totalProblems(totalProblems)
                .easyProblems(easyProblems)
                .mediumProblems(mediumProblems)
                .hardProblems(hardProblems)
                .totalSubmissions(totalSubmissions)
                .totalDailySubmissions(totalDailySubmissions)
                .acceptedRate(acceptedRate)
                .submissionLast7Days(dailyCounts)
                .recentSubmission(recentSubmissions)
                .build();
    }
}
