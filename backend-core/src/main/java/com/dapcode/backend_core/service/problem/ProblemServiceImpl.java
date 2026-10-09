package com.dapcode.backend_core.service.problem;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dapcode.backend_core.common.ErrorCode;
import com.dapcode.backend_core.dto.admin.CreateProblemRequest;
import com.dapcode.backend_core.dto.admin.UpdateProblemRequest;
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
        private final ObjectMapper objectMapper = new ObjectMapper();

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

                Map<String, String> starterCodeMap = null;
                if (problem.getStarterCode() != null && !problem.getStarterCode().isBlank()) {
                        try {
                                starterCodeMap = objectMapper.readValue(
                                                problem.getStarterCode(),
                                                new TypeReference<Map<String, String>>() {
                                                });
                        } catch (Exception ignored) {
                        }
                }

                return ProblemDetailResponse.builder()
                                .id(problem.getId())
                                .slug(problem.getSlug())
                                .title(problem.getTitle())
                                .difficulty(problem.getDifficulty())
                                .category(problem.getCategory())
                                .descriptionMarkdown(problem.getDescriptionMarkdown())
                                .timeLimitMs(problem.getTimeLimitMs())
                                .memoryLimitKb(problem.getMemoryLimitKb())
                                .starterCode(starterCodeMap)
                                .publicTestCases(testCaseDtos)
                                .build();
        }

        // Cho admin

        private String toSlug(String input) {
                if (input == null)
                        return "";
                return input.trim().toLowerCase()
                                .replaceAll("[áàảãạăắằẳẵặâấầẩẫậ]", "a")
                                .replaceAll("[éèẻẽẹêếềểễệ]", "e")
                                .replaceAll("[íìỉĩị]", "i")
                                .replaceAll("[óòỏõọôốồổỗộơớờởỡợ]", "o")
                                .replaceAll("[úùủũụưứừửữự]", "u")
                                .replaceAll("[ýỳỷỹỵ]", "y")
                                .replaceAll("đ", "d")
                                .replaceAll("[^a-z0-9\\s-]", "")
                                .replaceAll("\\s+", "-")
                                .replaceAll("-+", "-");
        }

        @Override
        @Transactional
        public ProblemDetailResponse createProblem(CreateProblemRequest req) {
                String slug = req.getSlug();
                if (slug == null || slug.isBlank()) {
                        slug = toSlug(req.getTitle());
                } else {
                        slug = toSlug(slug);
                }

                if (problemRepository.existsBySlug(slug)) {
                        slug = slug + "-" + UUID.randomUUID().toString().substring(0, 6);
                }

                Problem problem = Problem.builder()
                                .title(req.getTitle().trim())
                                .slug(slug)
                                .difficulty(req.getDifficulty())
                                .category(req.getCategory())
                                .descriptionMarkdown(req.getDescriptionMarkdown())
                                .timeLimitMs(req.getTimeLimitMs() > 0 ? req.getTimeLimitMs() : 2000)
                                .memoryLimitKb(req.getMemoryLimitKb() > 0 ? req.getMemoryLimitKb() : 262144)
                                .starterCode(req.getStarterCode())
                                .isPublished(req.isPublished())
                                .build();

                problem = problemRepository.save(problem);

                return getProblemBySlug(problem.getSlug());
        }

        @Override
        @Transactional
        public ProblemDetailResponse updateProblem(UUID id, UpdateProblemRequest req) {
                Problem problem = problemRepository.findById(id)
                                .orElseThrow(() -> new AppException(ErrorCode.PROBLEM_NOT_FOUND));

                problem.setTitle(req.getTitle().trim());
                problem.setDifficulty(req.getDifficulty());
                if (req.getCategory() != null) {
                        problem.setCategory(req.getCategory());
                }
                problem.setDescriptionMarkdown(req.getDescriptionMarkdown());
                if (req.getTimeLimitMs() != null && req.getTimeLimitMs() > 0) {
                        problem.setTimeLimitMs(req.getTimeLimitMs());
                }
                if (req.getMemoryLimitKb() != null && req.getMemoryLimitKb() > 0) {
                        problem.setMemoryLimitKb(req.getMemoryLimitKb());
                }
                if (req.getStarterCode() != null) {
                        problem.setStarterCode(req.getStarterCode());
                }
                if (req.getIsPublished() != null) {
                        problem.setPublished(req.getIsPublished());
                }
                Problem updated = problemRepository.save(problem);
                return getProblemBySlug(updated.getSlug());
        }

        @Override
        @Transactional
        public void deleteProblem(UUID id) {
                Problem problem = problemRepository.findById(id)
                                .orElseThrow(() -> new AppException(ErrorCode.PROBLEM_NOT_FOUND));
                problemRepository.delete(problem);
        }

        @Override
        public PageResponse<ProblemSummaryResponse> getAdminProblems(
                        String category,
                        String difficulty,
                        String search,
                        Boolean isPublished,
                        Pageable pageable) {
                return getProblems(category, difficulty, search, pageable);
        }
}
