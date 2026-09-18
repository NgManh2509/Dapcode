package com.dapcode.backend_core.service.submission;

import com.dapcode.backend_core.dto.submission.SubmissionResponse;
import com.dapcode.backend_core.dto.submission.SubmitCodeRequest;

public interface SubmissionService {

    SubmissionResponse submitAndEvaluate(SubmitCodeRequest request);
}
