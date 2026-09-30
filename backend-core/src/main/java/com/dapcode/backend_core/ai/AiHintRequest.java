package com.dapcode.backend_core.ai;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiHintRequest {

    @JsonProperty("problem_slug")
    private String problemSlug;

    private String code;

    private String language;

    @JsonProperty("hint_level")
    private Integer hintLevel;

    @JsonProperty("error_message")
    private String errorMessage;

    private String question;

}
