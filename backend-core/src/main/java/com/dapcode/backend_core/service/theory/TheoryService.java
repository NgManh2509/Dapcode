package com.dapcode.backend_core.service.theory;

import java.util.List;

import com.dapcode.backend_core.dto.theory.TheoryDetailResponse;
import com.dapcode.backend_core.dto.theory.TheorySummaryResponse;

public interface TheoryService {
    List<TheorySummaryResponse> getTheories(String category);

    TheoryDetailResponse getTheoryBySlug(String slug);

    List<String> getCategories();
}
