package com.dapcode.backend_core.judge0;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

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

    private static String decodeBase64Safe(String val) {
        if (val == null || val.isBlank()) {
            return val;
        }
        try {
            String clean = val.replaceAll("\\s+", "");
            byte[] decoded = Base64.getDecoder().decode(clean);
            return new String(decoded, StandardCharsets.UTF_8);
        } catch (IllegalArgumentException e) {
            try {
                byte[] decoded = Base64.getMimeDecoder().decode(val);
                return new String(decoded, StandardCharsets.UTF_8);
            } catch (Exception ex) {
                return val;
            }
        }
    }

    public String getStdout() {
        return decodeBase64Safe(stdout);
    }

    public String getStderr() {
        return decodeBase64Safe(stderr);
    }

    public String getCompile_output() {
        return decodeBase64Safe(compile_output);
    }

    public String getCompileOutput() {
        return decodeBase64Safe(compile_output);
    }

    public Judge0Status getJudge0Status() {
        if (status == null) {
            return Judge0Status.INTERNAL_ERROR;
        }
        return Judge0Status.fromId(status.getId());
    }
}
