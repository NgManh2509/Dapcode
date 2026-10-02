package com.dapcode.backend_core.service.submission;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.dapcode.backend_core.dto.submission.SubmissionResponse;
import com.dapcode.backend_core.dto.submission.SubmitCodeRequest;
import com.dapcode.backend_core.entity.Users;
import com.dapcode.backend_core.repository.UserRepository;

@SpringBootTest
class SubmissionHarnessIntegrationTest {

    @Autowired
    private SubmissionService submissionService;

    @Autowired
    private UserRepository userRepository;

    private Users testUser;

    @BeforeEach
    void setUp() {
        testUser = userRepository.findByEmail("tester_harness@dapcode.com")
                .orElseGet(() -> userRepository.save(Users.builder()
                        .username("tester_harness_" + System.currentTimeMillis())
                        .email("tester_harness@dapcode.com")
                        .passwordHash("dummy_hash")
                        .role("ROLE_USER")
                        .xp(0)
                        .streakCount(0)
                        .build()));
    }

    @Test
    @DisplayName("C++: Submit pure Solution class without main or input parsing -> ACCEPTED")
    void testCppPureSolutionSubmission() {
        String cppCode = """
                #include <iostream>
                #include <vector>
                #include <unordered_map>
                using namespace std;

                class Solution {
                public:
                    vector<int> twoSum(vector<int>& nums, int target) {
                        unordered_map<int, int> mp;
                        for (int i = 0; i < (int)nums.size(); i++) {
                            int need = target - nums[i];
                            if (mp.count(need)) return {mp[need], i};
                            mp[nums[i]] = i;
                        }
                        return {};
                    }
                };
                """;

        SubmitCodeRequest request = SubmitCodeRequest.builder()
                .problemSlug("two-sum")
                .languageId(54)
                .sourceCode(cppCode)
                .userId(testUser.getId())
                .build();

        SubmissionResponse res = submissionService.submitAndEvaluate(request);
        assertNotNull(res);
        res.getTestCaseResults().forEach(tc -> {
            System.out.println("CPP TC status=" + tc.getStatus() + ", exp=" + tc.getExpectedOutput() + ", act=" + tc.getActualOutput() + ", err=" + tc.getErrMes());
        });
        assertEquals("ACCEPTED", res.getStatus());
        assertEquals(res.getTestCaseResults().size(), res.getPassedTestCases());
    }

    @Test
    @DisplayName("Python: Submit pure Solution class without main or input parsing -> ACCEPTED")
    void testPythonPureSolutionSubmission() {
        String pythonCode = """
                class Solution:
                    def twoSum(self, nums: list[int], target: int) -> list[int]:
                        mp = {}
                        for i, num in enumerate(nums):
                            if target - num in mp:
                                return [mp[target - num], i]
                            mp[num] = i
                        return None
                """;

        SubmitCodeRequest request = SubmitCodeRequest.builder()
                .problemSlug("two-sum")
                .languageId(71)
                .sourceCode(pythonCode)
                .userId(testUser.getId())
                .build();

        SubmissionResponse res = submissionService.submitAndEvaluate(request);
        assertNotNull(res);
        res.getTestCaseResults().forEach(tc -> {
            System.out.println("PY TC status=" + tc.getStatus() + ", exp=" + tc.getExpectedOutput() + ", act=" + tc.getActualOutput() + ", err=" + tc.getErrMes());
        });
        assertEquals("ACCEPTED", res.getStatus());
        assertEquals(res.getTestCaseResults().size(), res.getPassedTestCases());
    }

}
