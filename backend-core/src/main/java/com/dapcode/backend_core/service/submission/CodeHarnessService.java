package com.dapcode.backend_core.service.submission;

public interface CodeHarnessService {
    String prepareSourceCode(String slug, int languageId, String rawSourceCode);
}
