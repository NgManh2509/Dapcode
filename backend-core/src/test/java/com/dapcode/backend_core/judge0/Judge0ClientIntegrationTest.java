package com.dapcode.backend_core.judge0;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class Judge0ClientIntegrationTest {

        @Autowired
        private Judge0Client judge0Client;

        @Test
        @DisplayName("1. Verify single Python code execution with stdin and stdout")
        void testExecuteSinglePythonSuccess() {
                // Python 3 (language_id = 71)
                Judge0SubmissionRequest request = Judge0SubmissionRequest.builder()
                                .language_id(71)
                                .source_code("a = int(input())\nb = int(input())\nprint(a + b)")
                                .stdin("10\n20\n")
                                .expected_output("30\n")
                                .cpu_time_limit(2.0)
                                .memory_limit(128000)
                                .build();

                Judge0Response response = judge0Client.executeSingle(request);

                assertNotNull(response, "Response from Judge0 should not be null");
                assertNotNull(response.getToken(), "Token should be present");
                assertEquals("30\n", response.getStdout());
                assertEquals(Judge0Status.ACCEPTED, response.getJudge0Status());
                assertTrue(response.getTime() != null && response.getTime() >= 0);
        }

        @Test
        @DisplayName("2. Verify runtime error detection (e.g. ZeroDivisionError)")
        void testExecuteSingleRuntimeError() {
                Judge0SubmissionRequest request = Judge0SubmissionRequest.builder()
                                .language_id(71)
                                .source_code("print(10 / 0)")
                                .build();

                Judge0Response response = judge0Client.executeSingle(request);

                assertNotNull(response);
                assertTrue(response.getJudge0Status().name().startsWith("RUNTIME_ERROR")
                                || response.getJudge0Status() == Judge0Status.RUNTIME_ERROR_NZEC);
                assertNotNull(response.getStderr());
                assertTrue(response.getStderr().contains("ZeroDivisionError"));
        }

        @Test
        @DisplayName("3. Verify batch submissions execution")
        void testExecuteBatch() {
                Judge0SubmissionRequest req1 = Judge0SubmissionRequest.builder()
                                .language_id(71)
                                .source_code("print('Testcase 1')")
                                .build();

                Judge0SubmissionRequest req2 = Judge0SubmissionRequest.builder()
                                .language_id(71)
                                .source_code("print('Testcase 2')")
                                .build();

                List<Judge0Response> responses = judge0Client.executeBatch(List.of(req1, req2));

                assertNotNull(responses);
                assertEquals(2, responses.size(), "Should receive 2 responses for 2 batch submissions");
                assertEquals("Testcase 1\n", responses.get(0).getStdout());
                assertEquals("Testcase 2\n", responses.get(1).getStdout());
                assertEquals(Judge0Status.ACCEPTED, responses.get(0).getJudge0Status());
                assertEquals(Judge0Status.ACCEPTED, responses.get(1).getJudge0Status());
        }
}
