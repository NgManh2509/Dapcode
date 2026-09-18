package com.dapcode.backend_core.service.submission;

import java.util.UUID;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dapcode.backend_core.common.ErrorCode;
import com.dapcode.backend_core.dto.submission.SubmissionResponse;
import com.dapcode.backend_core.dto.submission.SubmitCodeRequest;
import com.dapcode.backend_core.dto.submission.TestCaseResult;
import com.dapcode.backend_core.entity.Problem;
import com.dapcode.backend_core.entity.Submission;
import com.dapcode.backend_core.entity.TestCase;
import com.dapcode.backend_core.entity.Users;
import com.dapcode.backend_core.exception.AppException;
import com.dapcode.backend_core.judge0.Judge0Client;
import com.dapcode.backend_core.judge0.Judge0Response;
import com.dapcode.backend_core.judge0.Judge0Status;
import com.dapcode.backend_core.judge0.Judge0SubmissionRequest;
import com.dapcode.backend_core.repository.ProblemRepository;
import com.dapcode.backend_core.repository.SubmissionRepository;
import com.dapcode.backend_core.repository.TestCaseRepository;
import com.dapcode.backend_core.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SubmissionServiceImpl implements SubmissionService {

    private final ProblemRepository problemRepository;

    private final TestCaseRepository testCaseRepository;

    private final SubmissionRepository submissionRepository;

    private final UserRepository userRepository;

    private final Judge0Client judge0Client;

    private record EvaluationSummary(
            String finalStatus,
            double totalRuntimeMs,
            int maxMemoryKb,
            int passedCount,
            List<TestCaseResult> testCaseResults) {
    }

    private Problem findProblemBySlug(String slug) {
        return problemRepository.findBySlug(slug).orElseThrow(() -> new AppException(ErrorCode.PROBLEM_NOT_FOUND));
    }

    private Users findUserById(UUID id) {
        if (id == null) {
            return null;
        }
        return userRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    private boolean isOutputMatched(String actual, String expected) {
        if (actual == null || expected == null) {
            return false;
        }
        return actual.trim().replace("\r\n", "\n")
                .equals(expected.trim().replace("\r\n", "\n"));
    }

    private EvaluationSummary evalutateResults(List<TestCase> testCases, List<Judge0Response> judge0Responses) {
        List<TestCaseResult> testCaseResults = new ArrayList<>();

        int passedCount = 0;

        double totalRuntimeMs = 0.0;
        int maxMemoryKb = 0;
        String finalStatus = "ACCEPTED";

        for (int i = 0; i < testCases.size(); i++) {
            TestCase tc = testCases.get(i);
            Judge0Response res = (i < judge0Responses.size()) ? judge0Responses.get(i) : null;

            double timeMs = (res != null && res.getTime() != null) ? res.getTime() * 1000.0 : 0.0;

            int memKb = (res != null && res.getMemory() != null) ? res.getMemory() : 0;
            totalRuntimeMs += timeMs;
            maxMemoryKb = Math.max(maxMemoryKb, memKb);

            String caseStatus = "INTERNAL_ERROR";
            if (res != null) {
                Judge0Status jStatus = res.getJudge0Status();
                if (jStatus == Judge0Status.ACCEPTED) {
                    if (isOutputMatched(res.getStdout(), tc.getExpectedOutput())) {
                        caseStatus = "ACCEPTED";
                        passedCount++;
                    } else {
                        caseStatus = "WRONG_ANSWER";
                    }
                } else {
                    caseStatus = jStatus.name();
                }
            }

            if (!"ACCEPTED".equals(caseStatus) && "ACCEPTED".equals(finalStatus)) {
                finalStatus = caseStatus;
            }

            TestCaseResult tcResult = TestCaseResult.builder()
                    .testCaseId(tc.getId())
                    .status(caseStatus)
                    .runtimeMs(timeMs)
                    .memoryKb(memKb)
                    .isHidden(tc.isHidden())
                    .inputData(tc.isHidden() ? null : tc.getInputData())
                    .expectedOutput(tc.isHidden() ? null : tc.getExpectedOutput())
                    .actualOutput(tc.isHidden() ? null : (res != null ? res.getStdout() : null))
                    .errMes(res != null ? (res.getStderr() != null ? res.getStderr() : res.getCompile_output()) : null)
                    .build();
            testCaseResults.add(tcResult);
        }

        return new EvaluationSummary(finalStatus, totalRuntimeMs, maxMemoryKb, passedCount, testCaseResults);

    }

    @Override
    @Transactional
    public SubmissionResponse submitAndEvaluate(SubmitCodeRequest request) {
        Problem prob = findProblemBySlug(request.getProblemSlug());

        List<TestCase> testCases = testCaseRepository.findByProblemId(prob.getId());
        if (testCases.isEmpty()) {
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }

        Users user = findUserById(request.getUserId());

        Submission submission = Submission.builder()
                .problem(prob)
                .user(user)
                .languageId(request.getLanguageId())
                .sourceCode(request.getSourceCode())
                .status("PENDING")
                .build();
        submission = submissionRepository.save(submission);

        List<Judge0SubmissionRequest> judge0SubmissionRequests = testCases.stream()
                .map(tc -> Judge0SubmissionRequest.builder()
                        .language_id(request.getLanguageId())
                        .source_code(request.getSourceCode())
                        .stdin(tc.getInputData())
                        .expected_output(tc.getExpectedOutput())
                        .cpu_time_limit(prob.getTimeLimitMs() / 1000.0)
                        .memory_limit(prob.getMemoryLimitKb())
                        .build())
                .toList();

        List<Judge0Response> judge0Responses = judge0Client.executeBatch(judge0SubmissionRequests);

        EvaluationSummary summary = evalutateResults(testCases, judge0Responses);

        submission.setStatus(summary.finalStatus());

        submission.setTotalRuntimeMs(summary.totalRuntimeMs());

        submission.setMaxMemoryKb(summary.maxMemoryKb());

        submissionRepository.save(submission);

        int xpEarned = 0;
        if ("ACCEPTED".equals(summary.finalStatus()) && user != null) {
            xpEarned = switch (prob.getDifficulty().toLowerCase()) {
                case "easy" -> 20;
                case "medium" -> 50;
                case "hard" -> 100;
                default -> 20;
            };
            user.setXp(user.getXp() + xpEarned);
            user.setStreakCount(user.getStreakCount() + 1);
            userRepository.save(user);
        }

        return SubmissionResponse.builder()
                .submissionId(submission.getId())
                .slug(prob.getSlug())
                .status(summary.finalStatus())
                .totalRuntimeMs((int) summary.totalRuntimeMs())
                .maxMemoryKb(summary.maxMemoryKb())
                .passedTestCases(summary.passedCount())
                .xpEarned(xpEarned)
                .currentStreak(user != null ? user.getStreakCount() : 0)
                .testCaseResults(summary.testCaseResults())
                .build();
    }

}
