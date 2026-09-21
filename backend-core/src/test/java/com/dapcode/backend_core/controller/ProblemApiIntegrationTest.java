package com.dapcode.backend_core.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import com.dapcode.backend_core.entity.Users;
import com.dapcode.backend_core.repository.UserRepository;

@SpringBootTest
class ProblemApiIntegrationTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private UserRepository userRepository;

    private MockMvc mockMvc;
    private Users testUser;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();

        testUser = userRepository.findByEmail("tester_api@dapcode.com")
                .orElseGet(() -> userRepository.save(Users.builder()
                        .username("tester_api_" + System.currentTimeMillis())
                        .email("tester_api@dapcode.com")
                        .passwordHash("dummy_hash")
                        .role("ROLE_USER")
                        .xp(0)
                        .streakCount(0)
                        .build()));
    }

    @Test
    @DisplayName("1. GET /api/v1/problems -> Trả về danh sách phân trang (20 bài)")
    void testGetProblemsPagination() throws Exception {
        mockMvc.perform(get("/api/v1/problems")
                        .param("page", "0")
                        .param("size", "20"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content.length()").value(20))
                .andExpect(jsonPath("$.data.page").value(0))
                .andExpect(jsonPath("$.data.size").value(20))
                .andExpect(jsonPath("$.data.totalElements").isNumber())
                .andExpect(jsonPath("$.data.totalPages").isNumber());
    }

    @Test
    @DisplayName("2. GET /api/v1/problems?difficulty=Easy -> Chỉ trả về bài có độ khó Easy")
    void testGetProblemsFilterByDifficulty() throws Exception {
        mockMvc.perform(get("/api/v1/problems")
                        .param("difficulty", "Easy")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content[0].difficulty").value("Easy"));
    }

    @Test
    @DisplayName("3. GET /api/v1/problems?search=concatenation -> Tìm kiếm theo từ khóa")
    void testGetProblemsSearch() throws Exception {
        mockMvc.perform(get("/api/v1/problems")
                        .param("search", "concatenation"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content[0].slug").value("concatenation-of-array"));
    }

    @Test
    @DisplayName("4. GET /api/v1/problems/{slug} -> Trả về chi tiết bài toán và public test cases")
    void testGetProblemBySlugSuccess() throws Exception {
        mockMvc.perform(get("/api/v1/problems/concatenation-of-array"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.slug").value("concatenation-of-array"))
                .andExpect(jsonPath("$.data.title").value("Concatenation of Array"))
                .andExpect(jsonPath("$.data.descriptionMarkdown").isNotEmpty())
                .andExpect(jsonPath("$.data.publicTestCases").isArray())
                .andExpect(jsonPath("$.data.publicTestCases[0].inputData").isNotEmpty());
    }

    @Test
    @DisplayName("5. GET /api/v1/problems/{slug} với slug không tồn tại -> Trả về 404 NOT_FOUND")
    void testGetProblemBySlugNotFound() throws Exception {
        mockMvc.perform(get("/api/v1/problems/bai-tap-khong-ton-tai-123456"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.code").value(1005));
    }

    @Test
    @DisplayName("6. POST /api/v1/submissions -> Gọi nộp bài qua REST Controller thành công")
    void testSubmitCodeViaController() throws Exception {
        String requestJson = """
            {
                "problemSlug": "concatenation-of-array",
                "userId": "%s",
                "languageId": 71,
                "sourceCode": "import sys\\nline = sys.stdin.read().strip()\\nif '=' in line:\\n    nums = eval(line.split('=')[1].strip())\\nelse:\\n    nums = eval(line)\\nprint(nums + nums)"
            }
            """.formatted(testUser.getId());

        mockMvc.perform(post("/api/v1/submissions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("ACCEPTED"))
                .andExpect(jsonPath("$.data.passedTestCases").isNumber())
                .andExpect(jsonPath("$.data.xpEarned").value(20));
    }
}
