package com.dapcode.backend_core.judge0;

import lombok.Data;

@Data
public class Judge0Response {
    private String token;
    private String stdout;
    private String stderr;
    private String compile_output;
    private String message;
    private Double time;
    private Integer memory;
    private Status status;

    @Data
    public static class Status {
        private int id;
        private String description;
    }

    public String getCompileOutput() {
        return compile_output;
    }

    public Judge0Status getJudge0Status() {
        if (status == null) {
            return Judge0Status.INTERNAL_ERROR;
        }
        return Judge0Status.fromId(status.getId());
    }
}
