package com.dapcode.backend_core.service.testcase;

import java.util.List;
import java.util.UUID;

import com.dapcode.backend_core.dto.admin.BatchCreateTestCaseRequest;
import com.dapcode.backend_core.dto.admin.TestCaseRequest;
import com.dapcode.backend_core.dto.admin.TestCaseResponse;

public interface TestCaseService {

    List<TestCaseResponse> getTestCasesByProblemId(UUID problemId);

    TestCaseResponse createTestCase(UUID problemId, TestCaseRequest req);

    List<TestCaseResponse> createBatchTestCases(UUID problemId, BatchCreateTestCaseRequest req);

    TestCaseResponse updateTestCase(UUID testCaseId, TestCaseRequest req);

    void deleteTestCase(UUID testCaseId);

}
