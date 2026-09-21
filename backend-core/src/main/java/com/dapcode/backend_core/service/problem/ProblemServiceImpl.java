package com.dapcode.backend_core.service.problem;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dapcode.backend_core.common.ErrorCode;
import com.dapcode.backend_core.dto.common.PageResponse;
import com.dapcode.backend_core.dto.problem.ProblemDetailResponse;
import com.dapcode.backend_core.dto.problem.ProblemSummaryResponse;
import com.dapcode.backend_core.entity.Problem;
import com.dapcode.backend_core.entity.TestCase;
import com.dapcode.backend_core.exception.AppException;
import com.dapcode.backend_core.repository.ProblemRepository;
import com.dapcode.backend_core.repository.TestCaseRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProblemServiceImpl implements ProblemService {

    private final ProblemRepository problemRepository;
    private final TestCaseRepository testCaseRepository;

    @Override
    public PageResponse<ProblemSummaryResponse> getProblems(
            String category,
            String difficulty,
            String search,
            Pageable pageable) {

        String cleanCategory = (category != null && !category.isBlank()) ? category.trim() : null;
        String cleanDifficulty = (difficulty != null && !difficulty.isBlank()) ? difficulty.trim() : null;
        String cleanSearch = (search != null && !search.isBlank()) ? search.trim() : null;

        Page<Problem> problemPage = problemRepository.findProblemsWithFilters(
                cleanCategory, cleanDifficulty, cleanSearch, pageable);

        List<ProblemSummaryResponse> content = problemPage.getContent().stream()
                .map(p -> ProblemSummaryResponse.builder()
                        .id(p.getId())
                        .slug(p.getSlug())
                        .title(p.getTitle())
                        .difficulty(p.getDifficulty())
                        .category(p.getCategory())
                        .build())
                .toList();

        return PageResponse.<ProblemSummaryResponse>builder()
                .content(content)
                .page(problemPage.getNumber())
                .size(problemPage.getSize())
                .totalElements(problemPage.getTotalElements())
                .totalPages(problemPage.getTotalPages())
                .isFirst(problemPage.isFirst())
                .isLast(problemPage.isLast())
                .build();
    }

    @Override
    public ProblemDetailResponse getProblemBySlug(String slug) {
        Problem problem = problemRepository.findBySlug(slug)
                .orElseThrow(() -> new AppException(ErrorCode.PROBLEM_NOT_FOUND));

        List<TestCase> publicTestCases = testCaseRepository.findByProblemIdAndIsHiddenFalse(problem.getId());

        List<ProblemDetailResponse.PublicTestCaseDto> testCaseDtos = publicTestCases.stream()
                .map(tc -> ProblemDetailResponse.PublicTestCaseDto.builder()
                        .id(tc.getId())
                        .inputData(tc.getInputData())
                        .expectedOutput(tc.getExpectedOutput())
                        .build())
                .toList();

        return ProblemDetailResponse.builder()
                .id(problem.getId())
                .slug(problem.getSlug())
                .title(problem.getTitle())
                .difficulty(problem.getDifficulty())
                .category(problem.getCategory())
                .descriptionMarkdown(problem.getDescriptionMarkdown())
                .timeLimitMs(problem.getTimeLimitMs())
                .memoryLimitKb(problem.getMemoryLimitKb())
                .publicTestCases(testCaseDtos)
                .build();
    }
}
