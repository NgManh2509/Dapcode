package com.dapcode.backend_core.service.auth;

import java.util.Collections;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dapcode.backend_core.common.ErrorCode;
import com.dapcode.backend_core.config.JwtTokenProvider;
import com.dapcode.backend_core.dto.auth.AuthResponse;
import com.dapcode.backend_core.dto.auth.LoginGoogleRequest;
import com.dapcode.backend_core.entity.Users;
import com.dapcode.backend_core.exception.AppException;
import com.dapcode.backend_core.dto.auth.UserSummaryDto;
import com.dapcode.backend_core.repository.UserRepository;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String googleClientId;

    private GoogleIdToken verifyGoogleIdToken(String idTokenString) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(),
                    new GsonFactory()).setAudience(Collections.singletonList(googleClientId)).build();
            return verifier.verify(idTokenString);
        } catch (Exception e) {
            log.error("Lỗi khi verify Google ID Token: {}", e.getMessage());
            return null;
        }
    }

    @Override
    @Transactional
    public AuthResponse authenticateWithGoogle(LoginGoogleRequest req) {
        GoogleIdToken token = verifyGoogleIdToken(req.getIdToken());
        if (token == null) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        GoogleIdToken.Payload payload = token.getPayload();
        String googleId = payload.getSubject();
        String email = payload.getEmail();
        String name = (String) payload.get("name");
        String pictureUrl = (String) payload.get("picture");

        Users user = userRepository.findByEmail(email).orElseGet(() -> {
            String username = (name != null && !name.isBlank()) ? name.trim() : email.split("@")[0];
            return Users.builder()
                    .username(username)
                    .email(email)
                    .googleId(googleId)
                    .avatarUrl(pictureUrl)
                    .role("ROLE_USER")
                    .xp(0)
                    .streakCount(0)
                    .build();
        });

        if (!user.isActive()) {
            throw new AppException(ErrorCode.USER_LOCKED);
        }

        if (user.getGoogleId() == null) {
            user.setGoogleId(googleId);
        }
        if (pictureUrl != null && !pictureUrl.equals(user.getAvatarUrl())) {
            user.setAvatarUrl(pictureUrl);
        }
        user = userRepository.save(user);
        String genToken = jwtTokenProvider.generateToken(user);

        return AuthResponse.builder()
                .token(genToken)
                .user(UserSummaryDto.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .email(user.getEmail())
                        .avatarUrl(user.getAvatarUrl())
                        .role(user.getRole())
                        .xp(user.getXp())
                        .streakCount(user.getStreakCount())
                        .build())
                .build();
    }
}
