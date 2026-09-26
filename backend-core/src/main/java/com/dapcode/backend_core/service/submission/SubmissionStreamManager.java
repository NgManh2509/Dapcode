package com.dapcode.backend_core.service.submission;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.dapcode.backend_core.dto.submission.SubmissionProgressEvent;
import com.dapcode.backend_core.dto.submission.SubmissionDetailResponse;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class SubmissionStreamManager {
    private static final long STREAM_TIMEOUT = 60_000L;

    private final Map<UUID, List<SseEmitter>> emitterMap = new ConcurrentHashMap<>();

    private void removeEmitter(UUID submissionId, SseEmitter emitter) {
        List<SseEmitter> emitters = emitterMap.get(submissionId);
        if (emitters != null) {
            emitters.remove(emitter);
            if (emitters.isEmpty()) {
                emitterMap.remove(submissionId);
            }
        }
    }

    public SseEmitter createEmitter(UUID submissionId) {
        SseEmitter emitter = new SseEmitter(STREAM_TIMEOUT);

        emitterMap.computeIfAbsent(submissionId, k -> new CopyOnWriteArrayList<>()).add(emitter);

        emitter.onCompletion(() -> removeEmitter(submissionId, emitter));

        emitter.onTimeout(() -> removeEmitter(submissionId, emitter));

        emitter.onError(e -> removeEmitter(submissionId, emitter));

        try {
            emitter.send(SseEmitter.event().name("INIT").data("Connected to Submission Stream"));
        } catch (IOException e) {
            log.warn("Không thể gửi event INIT cho submissionId: {}", submissionId);
            removeEmitter(submissionId, emitter);
        }

        return emitter;
    }

    public void sendProgress(UUID submissionId, SubmissionProgressEvent event) {
        List<SseEmitter> emitters = emitterMap.get(submissionId);

        if (emitters == null || emitters.isEmpty()) {
            return;
        }

        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event().name("TEST_PROGRESS").data(event));
            } catch (IOException e) {
                log.warn("Lỗi khi gửi TEST_PROGRESS cho submissionId: {}", submissionId);
                removeEmitter(submissionId, emitter);
            }
        }
    }

    public void sendCompleted(UUID submissionId, Object response) {
        List<SseEmitter> emitters = emitterMap.remove(submissionId);
        if (emitters == null || emitters.isEmpty()) {
            return;
        }

        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event().name("SUBMISSION_COMPLETE").data(response));
                emitter.complete();
            } catch (IOException e) {
                log.warn("Lỗi khi gửi SUBMISSION_COMPLETE cho submissionId: {}", submissionId);
                emitter.completeWithError(e);
            }
        }
    }

    public void sendError(UUID submissionId, String errorMessage) {
        List<SseEmitter> emitters = emitterMap.remove(submissionId);
        if (emitters == null || emitters.isEmpty()) {
            return;
        }
        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event()
                        .name("ERROR")
                        .data(errorMessage));
                emitter.complete();
            } catch (IOException e) {
                emitter.completeWithError(e);
            }
        }
    }
}
