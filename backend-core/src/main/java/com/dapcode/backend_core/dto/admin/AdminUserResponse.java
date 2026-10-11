package com.dapcode.backend_core.dto.admin;

import java.time.Instant;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserResponse {
    private UUID id;
    private String username;
    private String email;
    private String avatarUrl;
    private String role;
    private int xp;
    private int streakCount;
    private boolean isActive;
    private String bannedReason;
    private Instant createdAt;
    private Instant updatedAt;
}
