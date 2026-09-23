package com.dapcode.backend_core.service.theory;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dapcode.backend_core.common.ErrorCode;
import com.dapcode.backend_core.dto.theory.TheoryDetailResponse;
import com.dapcode.backend_core.dto.theory.TheorySummaryResponse;
import com.dapcode.backend_core.entity.Theories;
import com.dapcode.backend_core.exception.AppException;
import com.dapcode.backend_core.repository.TheoryRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class TheoryServiceImpl implements TheoryService {

    private final TheoryRepository theoryRepository;

    @Override
    public List<TheorySummaryResponse> getTheories(String category) {
        String cleanCategory = (category != null && !category.isBlank()) ? category.trim() : null;

        List<Theories> list = theoryRepository.findPublishedTheories(cleanCategory);

        return list.stream()
                .map(t -> TheorySummaryResponse.builder()
                        .id(t.getId())
                        .slug(t.getSlug())
                        .title(t.getTitle())
                        .category(t.getCategory())
                        .summary(t.getSummary())
                        .orderIndex(t.getOrderIndex())
                        .build())
                .toList();
    }

    @Override
    public TheoryDetailResponse getTheoryBySlug(String slug) {
        Theories theory = theoryRepository.findBySlugAndIsPublishedTrue(slug)
                .orElseThrow(() -> new AppException(ErrorCode.THEORY_NOT_FOUND));
        return TheoryDetailResponse.builder()
                .id(theory.getId())
                .slug(theory.getSlug())
                .title(theory.getTitle())
                .category(theory.getCategory())
                .summary(theory.getSummary())
                .contentMarkdown(theory.getContentMarkdown())
                .orderIndex(theory.getOrderIndex())
                .build();
    }

    @Override
    public List<String> getCategories() {
        return theoryRepository.findDistinctCategories();
    }

}
