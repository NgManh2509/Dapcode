package com.dapcode.backend_core.dto.auth;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSummaryDto {
    private UUID id;
    private String username;
    private String email;
    private String avatarUrl;
    private String role;
    private int xp;
    private int streakCount;
}
