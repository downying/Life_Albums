package com.yahobong.server.security;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.yahobong.server.security.jwt.provider.JwtTokenProvider;
import com.yahobong.server.users.dto.CustomUser;
import com.yahobong.server.users.dto.Users;

import lombok.extern.slf4j.Slf4j;

/**
 * ✅ 로그인 성공 처리 클래스
 */
@Slf4j
@Component
public class LoginSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {
    
    private final JwtTokenProvider jwtTokenProvider;

    public LoginSuccessHandler(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    /**
     * 인증 성공 시 실행되는 메소드
     */
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws ServletException, IOException {
        
        log.info("로그인 인증 성공...");

        // 아이디 저장 로직
        String rememberId = request.getParameter("remember-id");
        String userId = request.getParameter("userId");
        log.info("rememberId : " + rememberId);
        log.info("userId : " + userId);

        if (rememberId != null && rememberId.equals("on")) {
            Cookie cookie = new Cookie("remember-id", userId);
            cookie.setMaxAge(60 * 60 * 24 * 7); // 7일 유효
            cookie.setPath("/");
            response.addCookie(cookie);
        } else {
            Cookie cookie = new Cookie("remember-id", "");
            cookie.setMaxAge(0);
            cookie.setPath("/");
            response.addCookie(cookie);
        }

        // 인증된 사용자 정보
        CustomUser customUser;
        if (authentication.getPrincipal() instanceof CustomUser) {
            customUser = (CustomUser) authentication.getPrincipal();
        } else {
            throw new IllegalStateException("Unexpected principal type: " + authentication.getPrincipal().getClass());
        }

        log.info("아이디 : " + customUser.getUsername());
        log.info("권한 : " + customUser.getAuthorities());

        HttpSession session = request.getSession();
        Users user = customUser.getUser();
        if (user != null) session.setAttribute("user", user);

        // JWT 토큰 생성
        int userNo = customUser.getUser().getUserNo();
        String accessToken = jwtTokenProvider.createToken(userNo, customUser.getUsername());
        String refreshToken = jwtTokenProvider.createRefreshToken(userNo, customUser.getUsername());

        // JWT 토큰 저장 로그 확인
        log.info("accessToken: {}", accessToken);
        log.info("refreshToken: {}", refreshToken);

        // 쿠키에 JWT 토큰 저장
        Cookie accessTokenCookie = new Cookie("accessToken", accessToken);
        accessTokenCookie.setMaxAge(60 * 60); // 1시간 유효
        accessTokenCookie.setPath("/");
        accessTokenCookie.setHttpOnly(true); // 쿠키를 HttpOnly로 설정 (JavaScript에서 접근 불가)
        response.addCookie(accessTokenCookie);

        Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);
        refreshTokenCookie.setMaxAge(60 * 60 * 24 * 7); // 7일 유효
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setHttpOnly(true); // HttpOnly 설정
        refreshTokenCookie.setSecure(false);  // HTTPS에서만 동작하도록 설정, 개발 시에는 false로 테스트
        response.addCookie(refreshTokenCookie);

        log.info("JWT 쿠키 추가 완료");

        // 리디렉션
        String redirectUrl = "http://localhost:3000/oauth2/redirect?token=" + accessToken;
        response.sendRedirect(redirectUrl);
    }
}
