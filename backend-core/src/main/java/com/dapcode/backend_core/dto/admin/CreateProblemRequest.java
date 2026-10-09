package com.dapcode.backend_core.dto.admin;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class CreateProblemRequest {
    private String slug;

    @NotBlank(message = "Tiêu đề không được để trống")
    @Size(max = 200, message = "Tiêu đề tối đa 200 ký tự")
    private String title;

    @NotBlank(message = "Độ khó không được để trống")
    private String difficulty;

    private String category;

    @NotBlank(message = "Mô tả đề bài không được để trống")
    private String descriptionMarkdown;

    @Builder.Default
    private int timeLimitMs = 2000;

    @Builder.Default
    private int memoryLimitKb = 262144;

    private String starterCode;

    @Builder.Default
    private boolean isPublished = true;
}
