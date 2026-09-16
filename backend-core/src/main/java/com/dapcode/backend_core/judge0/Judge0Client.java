package com.dapcode.backend_core.judge0;

import java.util.List;

public interface Judge0Client {
    Judge0Response executeSingle(Judge0SubmissionRequest req);

    List<Judge0Response> executeBatch(List<Judge0SubmissionRequest> req);
}
