package com.dapcode.backend_core.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "problems")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Problem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = 100)
    private String slug; // để thay cho cái uuid bằng tên của của bài

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, length = 20)
    private String difficulty;

    @Column(name = "description_markdown", nullable = false, columnDefinition = "TEXT")
    private String descriptionMarkdown;

    @Builder.Default
    @Column(name = "time_limit_ms", nullable = false)
    private int timeLimitMs = 2000;

    @Builder.Default
    @Column(name = "memory_limit_kb", nullable = false)
    private int memoryLimitKb = 262144; // 256MB

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;
}
