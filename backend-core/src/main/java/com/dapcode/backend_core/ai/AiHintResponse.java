package com.dapcode.backend_core.ai;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiHintResponse {
    @JsonProperty("problem_slug")
    private String problemSlug;

    @JsonProperty("problem_title")
    private String problemTitle;

    @JsonProperty("hint_lv")
    private Integer hintLevel;

    private String hint;

    @JsonProperty("related_concept")
    private String relatedConcept;
}
