package com.dapcode.backend_core.dto.admin;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProblemRequest {

    @NotBlank(message = "Tiêu đề không được để trống")
    @Size(max = 200, message = "Tiêu đề tối đa 200 ký tự")
    private String title;

    @NotBlank(message = "Độ khó không được để trống")
    private String difficulty;

    private String category;

    @NotBlank(message = "Mô tả đề bài không được để trống")
    private String descriptionMarkdown;

    private Integer timeLimitMs;

    private Integer memoryLimitKb;

    private String starterCode;

    private Boolean isPublished;
}
