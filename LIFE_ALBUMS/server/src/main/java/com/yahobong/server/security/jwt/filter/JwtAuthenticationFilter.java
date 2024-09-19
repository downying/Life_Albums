package com.yahobong.server.security.jwt.filter;

import java.io.IOException;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.yahobong.server.security.jwt.constants.SecurityConstants;
import com.yahobong.server.security.jwt.provider.JwtTokenProvider;
import com.yahobong.server.users.dto.CustomUser;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class JwtAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    // 생성자
    public JwtAuthenticationFilter(AuthenticationManager authenticationManager, JwtTokenProvider jwtTokenProvider) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        // 로그인 경로 설정: /login
        setFilterProcessesUrl(SecurityConstants.AUTH_LOGIN_URL);
    }

    @Override
public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
        throws AuthenticationException {
    log.info("로그인 인증 시도 메소드 작동 : attemptAuthentication()");
    
    // 쿠키에서 refreshToken 확인
    Cookie[] cookies = request.getCookies();
    if (cookies != null) {
        for (Cookie cookie : cookies) {
            if ("refreshToken".equals(cookie.getName())) {
                String refreshToken = cookie.getValue();
                
                // refreshToken 유효성 검사
                if (jwtTokenProvider.validateToken(refreshToken)) {
                    log.info("유효한 refreshToken 발견, 자동으로 인증 시도");
                    
                    // refreshToken으로 사용자 인증 정보 추출
                    Authentication authentication = jwtTokenProvider.getAuthentication(refreshToken);
                    return authenticationManager.authenticate(authentication);
                }
            }
        }
    }
    
    // refreshToken이 없거나 유효하지 않으면 일반 로그인 처리
    String id = request.getParameter("id");
    String pw = request.getParameter("pw");
    log.info("id : " + id);
    log.info("password : " + pw);
    
    Authentication authentication = new UsernamePasswordAuthenticationToken(id, pw);
    authentication = authenticationManager.authenticate(authentication);
    
    return authentication;
}
    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain,
            Authentication authentication) throws IOException, ServletException {
        log.info("인증 성공 (auth SUCCESS)");

        // 사용자 정보 가져오기
        CustomUser user = ((CustomUser) authentication.getPrincipal());
        int userNo = user.getUser().getUserNo();
        String userId = user.getUser().getId();

        log.info("userNo: {}, userId: {}", userNo, userId);

        // JWT 생성
        String accessToken = jwtTokenProvider.createToken(userNo, userId);
        String refreshToken = jwtTokenProvider.createRefreshToken(userNo, userId);

        // 토큰 생성 실패 확인
        if (accessToken == null || accessToken.isEmpty()) {
            log.error("JWT 토큰 생성에 실패했습니다.");
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            return;
        }

        // 쿠키로 Access Token과 Refresh Token을 응답에 추가
        Cookie accessTokenCookie = new Cookie("accessToken", accessToken);
        accessTokenCookie.setMaxAge(60 * 60); // 1시간
        accessTokenCookie.setPath("/");
        response.addCookie(accessTokenCookie);

        Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);
        refreshTokenCookie.setMaxAge(60 * 60 * 24 * 7); // 7일
        refreshTokenCookie.setPath("/");
        response.addCookie(refreshTokenCookie);

        response.setStatus(HttpServletResponse.SC_OK);
    }
}
