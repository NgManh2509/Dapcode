package com.dapcode.backend_core.service.testcase;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dapcode.backend_core.common.ErrorCode;
import com.dapcode.backend_core.dto.admin.BatchCreateTestCaseRequest;
import com.dapcode.backend_core.dto.admin.TestCaseRequest;
import com.dapcode.backend_core.dto.admin.TestCaseResponse;
import com.dapcode.backend_core.entity.Problem;
import com.dapcode.backend_core.entity.TestCase;
import com.dapcode.backend_core.exception.AppException;
import com.dapcode.backend_core.repository.ProblemRepository;
import com.dapcode.backend_core.repository.TestCaseRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TestCaseServiceImpl implements TestCaseService {

    private final TestCaseRepository testCaseRepository;
    private final ProblemRepository problemRepository;

    private TestCaseResponse mapToResponse(TestCase tc) {
        return TestCaseResponse.builder()
                .id(tc.getId())
                .problemId(tc.getProblem().getId())
                .inputData(tc.getInputData())
                .expectedOutput(tc.getExpectedOutput())
                .isHidden(tc.isHidden())
                .createdAt(tc.getCreatedAt())
                .build();
    }

    @Override
    public List<TestCaseResponse> getTestCasesByProblemId(UUID problemId) {
        if (!problemRepository.existsById(problemId)) {
            throw new AppException(ErrorCode.PROBLEM_NOT_FOUND);
        }
        return testCaseRepository.findByProblemId(problemId).stream().map(this::mapToResponse).toList();
    }

    @Override
    @Transactional
    public List<TestCaseResponse> createBatchTestCases(UUID problemId, BatchCreateTestCaseRequest req) {
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new AppException(ErrorCode.PROBLEM_NOT_FOUND));
        List<TestCase> entities = req.getTestCases().stream().map(tc -> TestCase.builder()
                .problem(problem)
                .inputData(tc.getInputData().trim())
                .expectedOutput(tc.getExpectedOutput().trim())
                .isHidden(tc.isHidden())
                .build()).toList();
        return testCaseRepository.saveAll(entities).stream().map(this::mapToResponse).toList();
    }

    @Override
    @Transactional
    public TestCaseResponse createTestCase(UUID problemId, TestCaseRequest req) {
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new AppException(ErrorCode.PROBLEM_NOT_FOUND));
        TestCase testCase = TestCase.builder()
                .problem(problem)
                .inputData(req.getInputData().trim())
                .expectedOutput(req.getExpectedOutput().trim())
                .isHidden(req.isHidden())
                .build();
        return mapToResponse(testCaseRepository.save(testCase));
    }

    @Override
    @Transactional
    public void deleteTestCase(UUID testCaseId) {
        TestCase tc = testCaseRepository.findById(testCaseId)
                .orElseThrow(() -> new AppException(ErrorCode.TEST_CASE_NOT_FOUND));
        testCaseRepository.delete(tc);
    }

    @Override
    @Transactional
    public TestCaseResponse updateTestCase(UUID testCaseId, TestCaseRequest req) {
        TestCase testCase = testCaseRepository.findById(testCaseId)
                .orElseThrow(() -> new AppException(ErrorCode.TEST_CASE_NOT_FOUND));
        testCase.setInputData(req.getInputData().trim());
        testCase.setExpectedOutput(req.getExpectedOutput().trim());
        testCase.setHidden(req.isHidden());
        return mapToResponse(testCaseRepository.save(testCase));
    }
}
