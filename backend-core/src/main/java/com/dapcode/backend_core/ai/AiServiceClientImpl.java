package com.dapcode.backend_core.ai;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.http.MediaType;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class AiServiceClientImpl implements AiServiceClient {
    private final RestClient aiRestClient;

    @Override
    public AiHintResponse getHint(AiHintRequest req) {
        log.info("Gửi yêu cầu xin gợi ý sang AI Service: problemSlug={}, hintLevel={}",
                req.getProblemSlug(), req.getHintLevel());

        return aiRestClient.post()
                .uri("/api/v1/tutor/hint")
                .contentType(MediaType.APPLICATION_JSON)
                .body(req)
                .retrieve()
                .body(AiHintResponse.class);
    }
}
