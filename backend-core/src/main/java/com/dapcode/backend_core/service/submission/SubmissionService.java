package com.dapcode.backend_core.service.submission;

import java.util.UUID;

import com.dapcode.backend_core.dto.submission.SubmissionDetailResponse;
import com.dapcode.backend_core.dto.submission.SubmissionResponse;
import com.dapcode.backend_core.dto.submission.SubmitCodeRequest;
import com.dapcode.backend_core.entity.Users;

public interface SubmissionService {

    SubmissionResponse submitAndEvaluate(SubmitCodeRequest request);

    SubmissionDetailResponse getSubmissionById(UUID id, Users currUser);
}
