package com.dapcode.backend_core.dto.submission;

import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmitCodeRequest {
    @NotBlank(message = "Slug is empty")
    private String problemSlug;

    @NotNull(message = "Language id is empty")
    private Integer languageId;

    @NotBlank(message = "Source code is empty")
    private String sourceCode;

    private UUID userId;
}
