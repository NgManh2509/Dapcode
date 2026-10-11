package com.dapcode.backend_core.dto.admin;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateTheoryRequest {

    @NotBlank(message = "Tiêu đề bài giảng không được để trống")
    @Size(max = 255, message = "Tiêu đề tối đa 255 ký tự")
    private String title;

    private String category;

    private String summary;

    @NotBlank(message = "Nội dung Markdown không được để trống")
    private String contentMarkdown;

    private Integer orderIndex;

    private Boolean isPublished;
}
