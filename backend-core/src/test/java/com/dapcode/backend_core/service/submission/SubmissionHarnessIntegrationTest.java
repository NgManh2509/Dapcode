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

    @Test
    @DisplayName("Special & In-place Problems: Verify in-place, cyclic list, tree LCA, graph, random list, codec -> ACCEPTED")
    void testSpecialAndInplaceProblems() {
        record Case(String slug, int lang, String code) {}
        java.util.List<Case> cases = java.util.List.of(
                new Case("sort-colors", 71, """
                        class Solution:
                            def sortColors(self, nums: list[int]) -> None:
                                nums.sort()
                        """),
                new Case("linked-list-cycle", 71, """
                        class Solution:
                            def hasCycle(self, head: Optional[ListNode]) -> bool:
                                slow = fast = head
                                while fast and fast.next:
                                    slow = slow.next
                                    fast = fast.next.next
                                    if slow == fast:
                                        return True
                                return False
                        """),
                new Case("lowest-common-ancestor-of-a-binary-search-tree", 71, """
                        class Solution:
                            def lowestCommonAncestor(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':
                                curr = root
                                while curr:
                                    if p.val > curr.val and q.val > curr.val:
                                        curr = curr.right
                                    elif p.val < curr.val and q.val < curr.val:
                                        curr = curr.left
                                    else:
                                        return curr
                                return None
                        """),
                new Case("encode-and-decode-strings", 71, """
                        class Solution:
                            def encode(self, strs: List[str]) -> str:
                                return "".join(f"{len(s)}#{s}" for s in strs)
                            def decode(self, s: str) -> List[str]:
                                res, i = [], 0
                                while i < len(s):
                                    j = s.find("#", i)
                                    length = int(s[i:j])
                                    res.append(s[j + 1 : j + 1 + length])
                                    i = j + 1 + length
                                return res
                        """),
                new Case("clone-graph", 71, """
                        class Solution:
                            def cloneGraph(self, node: Optional['Node']) -> Optional['Node']:
                                if not node:
                                    return None
                                old_to_new = {}
                                def dfs(n):
                                    if n in old_to_new:
                                        return old_to_new[n]
                                    copy = Node(n.val)
                                    old_to_new[n] = copy
                                    for nei in n.neighbors:
                                        copy.neighbors.append(dfs(nei))
                                    return copy
                                return dfs(node)
                        """)
        );

        for (Case c : cases) {
            SubmitCodeRequest req = SubmitCodeRequest.builder()
                    .problemSlug(c.slug())
                    .languageId(c.lang())
                    .sourceCode(c.code())
                    .userId(testUser.getId())
                    .build();
            SubmissionResponse res = submissionService.submitAndEvaluate(req);
            assertNotNull(res);
            assertEquals("ACCEPTED", res.getStatus(), "Failed on slug: " + c.slug());
            assertEquals(res.getTestCaseResults().size(), res.getPassedTestCases(), "Not all test cases passed on: " + c.slug());
        }
    }

}
