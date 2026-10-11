package com.dapcode.backend_core.service.user;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dapcode.backend_core.common.ErrorCode;
import com.dapcode.backend_core.dto.admin.AdminUserResponse;
import com.dapcode.backend_core.dto.admin.UpdateUserRoleRequest;
import com.dapcode.backend_core.dto.admin.UpdateUserStatusRequest;
import com.dapcode.backend_core.dto.common.PageResponse;
import com.dapcode.backend_core.entity.Users;
import com.dapcode.backend_core.exception.AppException;
import com.dapcode.backend_core.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminUserServiceImpl implements AdminUserService {
    private final UserRepository userRepository;

    private AdminUserResponse mapToResponse(Users u) {
        return AdminUserResponse.builder()
                .id(u.getId())
                .username(u.getUsername())
                .email(u.getEmail())
                .avatarUrl(u.getAvatarUrl())
                .role(u.getRole())
                .xp(u.getXp())
                .streakCount(u.getStreakCount())
                .isActive(u.isActive())
                .bannedReason(u.getBannedReason())
                .createdAt(u.getCreatedAt())
                .updatedAt(u.getUpdatedAt())
                .build();
    }

    @Override
    public PageResponse<AdminUserResponse> getUsers(String search, String role, Boolean isActive, Pageable pageable) {
        String cleanSearch = (search != null && !search.isBlank()) ? search.trim() : null;
        String cleanRole = (role != null && !role.isBlank()) ? role.trim() : null;
        Page<Users> page = userRepository.findUsersWithFilters(cleanSearch, cleanRole, isActive, pageable);

        List<AdminUserResponse> content = page.getContent().stream().map(this::mapToResponse).toList();

        return PageResponse.<AdminUserResponse>builder()
                .content(content)
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .isFirst(page.isFirst())
                .isLast(page.isLast())
                .build();
    }

    @Override
    public AdminUserResponse getUserById(UUID id) {
        Users user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return mapToResponse(user);
    }

    @Override
    @Transactional
    public AdminUserResponse updateUserStatus(UUID id, UpdateUserStatusRequest req, Users currentAdmin) {
        Users user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        if (currentAdmin != null && currentAdmin.getId().equals(user.getId()) && !req.isActive()) {
            throw new AppException(ErrorCode.INVALID_REQUEST);
        }
        user.setActive(req.isActive());
        user.setBannedReason(req.isActive() ? null : req.getBannedReason());
        return mapToResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    public AdminUserResponse updateUserRole(UUID id, UpdateUserRoleRequest req, Users currentAdmin) {
        Users user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        if (currentAdmin != null && currentAdmin.getId().equals(user.getId()) && !"ROLE_ADMIN".equals(req.getRole())) {
            throw new AppException(ErrorCode.INVALID_REQUEST);
        }
        String targetRole = req.getRole().trim().toUpperCase();
        if (!targetRole.startsWith("ROLE_")) {
            targetRole = "ROLE_" + targetRole;
        }
        user.setRole(targetRole);
        return mapToResponse(userRepository.save(user));
    }

}
