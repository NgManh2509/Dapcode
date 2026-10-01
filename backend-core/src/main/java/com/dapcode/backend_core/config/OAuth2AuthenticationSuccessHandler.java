package com.dapcode.backend_core.config;

import java.io.IOException;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import com.dapcode.backend_core.entity.Users;
import com.dapcode.backend_core.repository.UserRepository;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String picture = oAuth2User.getAttribute("picture");
        String googleId = oAuth2User.getAttribute("sub");

        log.info("Google OAuth2 login success: email={}, name={}, googleId={}", email, name, googleId);

        Users user = userRepository.findByEmail(email).orElseGet(() -> {
            String username = (name != null && !name.isBlank()) ? name.trim() : (email != null ? email.split("@")[0] : "user");
            return Users.builder()
                    .username(username)
                    .email(email)
                    .googleId(googleId)
                    .avatarUrl(picture)
                    .role("ROLE_USER")
                    .xp(0)
                    .streakCount(0)
                    .build();
        });

        if (user.getGoogleId() == null) {
            user.setGoogleId(googleId);
        }
        if (picture != null && !picture.equals(user.getAvatarUrl())) {
            user.setAvatarUrl(picture);
        }
        user = userRepository.save(user);

        String token = jwtTokenProvider.generateToken(user);

        String targetUrl = UriComponentsBuilder.fromUriString("http://localhost:5173/auth/callback")
                .queryParam("token", token)
                .build().toUriString();

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
