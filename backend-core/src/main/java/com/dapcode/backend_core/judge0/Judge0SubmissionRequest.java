package com.dapcode.backend_core.judge0;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Judge0SubmissionRequest {
    private String source_code;
    private int language_id;
    private String stdin;
    private String expected_output;
    private Double cpu_time_limit;
    private Integer memory_limit;
    private Boolean enable_per_process_and_thread_memory_limit;

    public String getSourceCode() {
        return source_code;
    }

    public int getLanguageId() {
        return language_id;
    }

    public String getExpectedOutput() {
        return expected_output;
    }

    public Double getCpuTimeLimit() {
        return cpu_time_limit;
    }

    public Integer getMemoryLimit() {
        return memory_limit;
    }
}
