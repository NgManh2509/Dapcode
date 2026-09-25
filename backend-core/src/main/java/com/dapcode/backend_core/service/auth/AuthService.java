package com.dapcode.backend_core.service.auth;

import com.dapcode.backend_core.dto.auth.AuthResponse;
import com.dapcode.backend_core.dto.auth.LoginGoogleRequest;

public interface AuthService {
    AuthResponse authenticateWithGoogle(LoginGoogleRequest req);
}
