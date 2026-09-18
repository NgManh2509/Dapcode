package com.dapcode.backend_core.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.dapcode.backend_core.dto.submission.SubmissionResponse;
import com.dapcode.backend_core.dto.submission.SubmitCodeRequest;
import com.dapcode.backend_core.entity.Users;
import com.dapcode.backend_core.repository.UserRepository;
import com.dapcode.backend_core.service.submission.SubmissionService;

@SpringBootTest
class SubmissionEvaluationIntegrationTest {

    @Autowired
    private SubmissionService submissionService;

    @Autowired
    private UserRepository userRepository;

    private Users testUser;

    @BeforeEach
    void setUp() {
        testUser = userRepository.findByEmail("tester@dapcode.com")
                .orElseGet(() -> userRepository.save(Users.builder()
                        .username("tester_" + System.currentTimeMillis())
                        .email("tester@dapcode.com")
                        .passwordHash("dummy_hash")
                        .role("ROLE_USER")
                        .xp(0)
                        .streakCount(0)
                        .build()));
    }

    @Test
    @DisplayName("1. Nộp code Python đúng -> Phải nhận ACCEPTED")
    void testSubmitCorrectPythonCode() {
        String correctCode = """
            import sys
            line = sys.stdin.read().strip()
            if "=" in line:
                nums = eval(line.split("=")[1].strip())
            else:
                nums = eval(line)
            print(nums + nums)
            """;

        SubmitCodeRequest request = SubmitCodeRequest.builder()
                .problemSlug("concatenation-of-array")
                .userId(testUser.getId())
                .languageId(71) // Python 3
                .sourceCode(correctCode)
                .build();

        SubmissionResponse response = submissionService.submitAndEvaluate(request);

        assertNotNull(response, "Response không được null");
        assertEquals("ACCEPTED", response.getStatus(), "Trạng thái phải là ACCEPTED");
        assertTrue(response.getPassedTestCases() > 0, "Số test passed phải lớn hơn 0");
        assertEquals(response.getPassedTestCases(), response.getTestCaseResults().size(), "Phải pass toàn bộ test cases");
        assertTrue(response.getXpEarned() > 0, "Phải được cộng XP khi pass bài");
    }

    @Test
    @DisplayName("2. Nộp code Python sai logic -> Phải nhận WRONG_ANSWER")
    void testSubmitWrongAnswerPythonCode() {
        String wrongCode = "print([999, 999])";

        SubmitCodeRequest request = SubmitCodeRequest.builder()
                .problemSlug("concatenation-of-array")
                .userId(testUser.getId())
                .languageId(71)
                .sourceCode(wrongCode)
                .build();

        SubmissionResponse response = submissionService.submitAndEvaluate(request);

        assertNotNull(response);
        assertEquals("WRONG_ANSWER", response.getStatus(), "Trạng thái phải là WRONG_ANSWER");
        assertEquals(0, response.getXpEarned(), "Không được cộng XP khi sai logic");
    }

    @Test
    @DisplayName("3. Nộp code có vòng lặp vô hạn -> Phải nhận TIME_LIMIT_EXCEEDED")
    void testSubmitTimeLimitExceeded() {
        String timeoutCode = """
            while True:
                pass
            """;

        SubmitCodeRequest request = SubmitCodeRequest.builder()
                .problemSlug("concatenation-of-array")
                .userId(testUser.getId())
                .languageId(71)
                .sourceCode(timeoutCode)
                .build();

        SubmissionResponse response = submissionService.submitAndEvaluate(request);

        assertNotNull(response);
        assertEquals("TIME_LIMIT_EXCEEDED", response.getStatus(), "Trạng thái phải là TIME_LIMIT_EXCEEDED");
    }
}
