package com.dapcode.backend_core.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.dapcode.backend_core.entity.Problem;
import com.dapcode.backend_core.entity.SubTask;
import com.dapcode.backend_core.entity.Submission;
import com.dapcode.backend_core.entity.SubmissionTaskResult;
import com.dapcode.backend_core.entity.TestCase;
import com.dapcode.backend_core.entity.Users;

@SpringBootTest
@Transactional
class Day5RepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProblemRepository problemRepository;

    @Autowired
    private SubTaskRepository subTaskRepository;

    @Autowired
    private TestCaseRepository testCaseRepository;

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private SubmissionTaskResultRepository submissionTaskResultRepository;

    @Test
    @DisplayName("1. Verify UserRepository CRUD and custom query methods")
    void testUserRepository() {
        Users user = Users.builder()
                .username("coder_dapcode")
                .email("coder@dapcode.com")
                .passwordHash("$2a$10$encrypted_pass_hash")
                .role("ROLE_USER")
                .xp(50)
                .streakCount(2)
                .build();

        Users savedUser = userRepository.save(user);

        assertNotNull(savedUser.getId(), "UUID should be automatically generated");
        assertTrue(userRepository.existsByEmail("coder@dapcode.com"));
        assertTrue(userRepository.existsByUsername("coder_dapcode"));

        Optional<Users> found = userRepository.findByEmail("coder@dapcode.com");
        assertTrue(found.isPresent());
        assertEquals("coder_dapcode", found.get().getUsername());
        assertEquals(50, found.get().getXp());
    }

    @Test
    @DisplayName("2. Verify Problem, SubTask, and TestCase hierarchy queries")
    void testProblemSubTaskAndTestCase() {
        // 1. Create Problem
        Problem problem = Problem.builder()
                .slug("two-sum-test")
                .title("Two Sum Problem")
                .difficulty("EASY")
                .descriptionMarkdown("# Đề bài Two Sum\nTìm 2 số có tổng bằng target.")
                .timeLimitMs(2000)
                .memoryLimitKb(262144)
                .build();
        Problem savedProblem = problemRepository.save(problem);
        assertNotNull(savedProblem.getId());

        // 2. Create SubTasks
        SubTask subTask1 = SubTask.builder()
                .problem(savedProblem)
                .stepOrder(1)
                .title("Chặng 1: Xử lý ca biên")
                .description("Kiểm tra mảng rỗng hoặc ít hơn 2 phần tử")
                .hintDirection("Đếm độ dài mảng")
                .verificationType("TEST_CASE")
                .build();

        SubTask subTask2 = SubTask.builder()
                .problem(savedProblem)
                .stepOrder(2)
                .title("Chặng 2: Vét cạn O(N^2)")
                .description("Duyệt 2 vòng lặp để tìm cặp số")
                .hintDirection("Sử dụng nested loop")
                .verificationType("TEST_CASE")
                .build();

        subTaskRepository.saveAll(List.of(subTask2, subTask1)); // save out of order

        // Verify ordering query
        List<SubTask> orderedSubTasks = subTaskRepository
                .findByProblemIdOrderByStepOrderAsc(savedProblem.getId());
        assertEquals(2, orderedSubTasks.size());
        assertEquals(1, orderedSubTasks.get(0).getStepOrder());
        assertEquals(2, orderedSubTasks.get(1).getStepOrder());

        // 3. Create TestCases (1 visible sample, 1 hidden)
        TestCase sampleTest = TestCase.builder()
                .problem(savedProblem)
                .subTask(subTask1)
                .inputData("[2,7,11,15]\n9")
                .expectedOutput("[0,1]")
                .isHidden(false)
                .build();

        TestCase hiddenTest = TestCase.builder()
                .problem(savedProblem)
                .subTask(subTask2)
                .inputData("[3,2,4]\n6")
                .expectedOutput("[1,2]")
                .isHidden(true)
                .build();

        testCaseRepository.saveAll(List.of(sampleTest, hiddenTest));

        // Verify test case queries
        List<TestCase> publicTests = testCaseRepository
                .findByProblemIdAndIsHiddenFalse(savedProblem.getId());
        assertEquals(1, publicTests.size());
        assertFalse(publicTests.get(0).isHidden());
        assertEquals("[2,7,11,15]\n9", publicTests.get(0).getInputData());

        List<TestCase> subTask1Tests = testCaseRepository.findBySubTaskId(subTask1.getId());
        assertEquals(1, subTask1Tests.size());
    }

    @Test
    @DisplayName("3. Verify Submission and SubTask evaluation results relationship")
    void testSubmissionAndTaskResults() {
        // Setup User & Problem
        Users user = userRepository.save(Users.builder()
                .username("learner1")
                .email("learner1@dapcode.com")
                .passwordHash("hash123")
                .build());

        Problem problem = problemRepository.save(Problem.builder()
                .slug("valid-anagram")
                .title("Valid Anagram")
                .difficulty("EASY")
                .descriptionMarkdown("# Valid Anagram")
                .build());

        SubTask subTask = subTaskRepository.save(SubTask.builder()
                .problem(problem)
                .stepOrder(1)
                .title("Chặng 1: So khớp độ dài chuỗi")
                .description("Kiểm tra len(s) == len(t)")
                .build());

        // Create Submission
        Submission submission = Submission.builder()
                .user(user)
                .problem(problem)
                .sourceCode("def isAnagram(s, t): return sorted(s) == sorted(t)")
                .languageId(71) // Python 3
                .status("ACCEPTED")
                .totalRuntimeMs(24.5)
                .maxMemoryKb(8192)
                .build();

        Submission savedSubmission = submissionRepository.save(submission);
        assertNotNull(savedSubmission.getId());

        // Create SubTask Result
        SubmissionTaskResult result = SubmissionTaskResult.builder()
                .submission(savedSubmission)
                .subTask(subTask)
                .passed(true)
                .feedbackMessage("Chặng 1 vượt qua thành công trong 0.01s!")
                .build();

        submissionTaskResultRepository.save(result);

        // Verify Submission queries
        List<Submission> userSubmissions = submissionRepository
                .findByUserIdOrderByCreatedAtDesc(user.getId());
        assertEquals(1, userSubmissions.size());
        assertEquals("ACCEPTED", userSubmissions.get(0).getStatus());

        List<SubmissionTaskResult> results = submissionTaskResultRepository
                .findBySubmissionId(savedSubmission.getId());
        assertEquals(1, results.size());
        assertTrue(results.get(0).isPassed());
        assertEquals("Chặng 1: So khớp độ dài chuỗi", results.get(0).getSubTask().getTitle());
    }
}
