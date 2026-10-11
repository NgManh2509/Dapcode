package com.dapcode.backend_core.service.theory;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dapcode.backend_core.common.ErrorCode;
import com.dapcode.backend_core.dto.admin.CreateTheoryRequest;
import com.dapcode.backend_core.dto.admin.UpdateTheoryRequest;
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

    @Override
    @Transactional
    public Theories createTheory(CreateTheoryRequest req) {
        String slug = req.getSlug();
        if (slug == null || slug.isBlank()) {
            slug = toSlug(req.getTitle());
        } else {
            slug = toSlug(slug);
        }

        if (theoryRepository.existsBySlug(slug)) {
            slug = slug + "-" + UUID.randomUUID().toString().substring(0, 6);
        }

        Theories theory = Theories.builder()
                .title(req.getTitle().trim())
                .slug(slug)
                .category(req.getCategory().trim())
                .summary(req.getSummary())
                .contentMarkdown(req.getContentMarkdown())
                .orderIndex(req.getOrderIndex())
                .isPublished(req.isPublished())
                .build();
        return theoryRepository.save(theory);
    }

    @Override
    @Transactional
    public Theories updateTheory(UUID id, UpdateTheoryRequest req) {
        Theories theory = theoryRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.THEORY_NOT_FOUND));

        theory.setTitle(req.getTitle().trim());
        if (req.getCategory() != null) {
            theory.setCategory(req.getCategory().trim());
        }
        theory.setSummary(req.getSummary());
        theory.setContentMarkdown(req.getContentMarkdown());
        if (req.getOrderIndex() != null) {
            theory.setOrderIndex(req.getOrderIndex());
        }
        if (req.getIsPublished() != null) {
            theory.setPublished(req.getIsPublished());
        }
        return theoryRepository.save(theory);
    }

    @Override
    @Transactional
    public void deleteTheory(UUID id) {
        Theories theory = theoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.THEORY_NOT_FOUND));
        theoryRepository.delete(theory);
    }

    @Override
    public List<Theories> getAdminTheories(String category) {
        String cleanCategory = (category != null && !category.isBlank()) ? category.trim() : null;

        return theoryRepository.findAllTheoriesForAdmin(cleanCategory);
    }

    @Override
    public Theories getAdminTheoryById(UUID id) {
        return theoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.THEORY_NOT_FOUND));
    }

}
