package com.dapcode.backend_core.service.user;

import java.util.UUID;

import org.springframework.data.domain.Pageable;

import com.dapcode.backend_core.dto.admin.AdminUserResponse;
import com.dapcode.backend_core.dto.admin.UpdateUserRoleRequest;
import com.dapcode.backend_core.dto.admin.UpdateUserStatusRequest;
import com.dapcode.backend_core.dto.common.PageResponse;
import com.dapcode.backend_core.entity.Users;

public interface AdminUserService {
    PageResponse<AdminUserResponse> getUsers(String search, String role, Boolean isActive, Pageable pageable);

    AdminUserResponse getUserById(UUID id);

    AdminUserResponse updateUserStatus(UUID id, UpdateUserStatusRequest req, Users currentAdmin);

    AdminUserResponse updateUserRole(UUID id, UpdateUserRoleRequest req, Users currentAdmin);
}
