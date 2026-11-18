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
        String clean = val.replaceAll("[\\r\\n]+", "");
        if (!clean.matches("^[A-Za-z0-9+/=]+$") || clean.length() % 4 != 0) {
            return val;
        }
        try {
            byte[] decoded = Base64.getDecoder().decode(clean);
            String str = new String(decoded, StandardCharsets.UTF_8);
            if (str.indexOf('\uFFFD') != -1) {
                return val;
            }
            return str;
        } catch (Exception e) {
            return val;
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
