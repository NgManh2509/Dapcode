package com.dapcode.backend_core.judge0;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class Judge0ClientImpl implements Judge0Client {

    private final RestClient judge0RestClient;

    @Override
    public Judge0Response executeSingle(Judge0SubmissionRequest request) {
        log.info("Sending submission to Judge0: languageId={}", request.getLanguageId());

        return judge0RestClient.post()
                .uri("/submissions?wait=true&base64_encoded=false")
                .contentType(MediaType.APPLICATION_JSON)
                .body(request)
                .retrieve()
                .body(Judge0Response.class);
    }

    @Override
    public List<Judge0Response> executeBatch(List<Judge0SubmissionRequest> requests) {
        if (requests == null || requests.isEmpty()) {
            return Collections.emptyList();
        }

        log.info("Sending batch submissions to Judge0: count={}", requests.size());

        Map<String, List<Judge0SubmissionRequest>> payload = Map.of("submissions", requests);

        List<Map<String, String>> tokenResponses = judge0RestClient.post()
                .uri("/submissions/batch?base64_encoded=false")
                .contentType(MediaType.APPLICATION_JSON)
                .body(payload)
                .retrieve()
                .body(new ParameterizedTypeReference<List<Map<String, String>>>() {
                });

        if (tokenResponses == null || tokenResponses.isEmpty()) {
            return Collections.emptyList();
        }

        String tokens = tokenResponses.stream()
                .map(res -> res.get("token"))
                .collect(Collectors.joining(","));

        String getUri = "/submissions/batch?tokens=" + tokens + "&base64_encoded=false";

        for (int attempt = 0; attempt < 40; attempt++) {
            try {
                Thread.sleep(300);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            }

            BatchResponse batchResult = judge0RestClient.get()
                    .uri(getUri)
                    .retrieve()
                    .body(BatchResponse.class);

            if (batchResult != null && batchResult.submissions() != null && !batchResult.submissions().isEmpty()) {
                boolean allFinished = batchResult.submissions().stream()
                        .allMatch(sub -> sub.getStatus() != null
                                && sub.getStatus().getId() != Judge0Status.IN_QUEUE.getId()
                                && sub.getStatus().getId() != Judge0Status.PROCESSING.getId());

                if (allFinished) {
                    return batchResult.submissions();
                }
            }
        }

        // Trường hợp hết thời gian poll, gọi lần cuối trả về kết quả hiện tại
        BatchResponse finalResult = judge0RestClient.get()
                .uri(getUri)
                .retrieve()
                .body(BatchResponse.class);

        return finalResult != null ? finalResult.submissions() : Collections.emptyList();
    }

    private record BatchResponse(List<Judge0Response> submissions) {
    }
}
