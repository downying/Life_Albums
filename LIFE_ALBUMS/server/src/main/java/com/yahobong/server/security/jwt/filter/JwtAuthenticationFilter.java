package com.yahobong.server.security.jwt.filter;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
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
public class JwtAuthenticationFilter extends UsernamePasswordAuthenticationFilter{
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    // 생성자
    public JwtAuthenticationFilter( AuthenticationManager authenticationManager,  JwtTokenProvider jwtTokenProvider ) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        // 🔗 필터 URL 경로 설정 : /login
        setFilterProcessesUrl(SecurityConstants.AUTH_LOGIN_URL);

        log.info(" JwtAuthenticationFilter 생성자 작동 ");
    }
    
    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
    throws AuthenticationException {
        
        log.info("로그인 인증 시도 메소드 작동 : attemptAuthentication()");
        String id = request.getParameter("id");
        String pw = request.getParameter("pw");

        log.info("id : " + id);
        log.info("password : " + pw);

        // 사용자 인증정보 객체 생성
        Authentication authentication = new UsernamePasswordAuthenticationToken(id, pw);

        // 사용자 인증 (로그인)
        authentication = authenticationManager.authenticate(authentication);

        log.info("authenticationManager : " + authenticationManager);
        log.info("authentication : " + authentication);
        log.info("인증 여부(isAuthenticated) : " + authentication.isAuthenticated());
        
        // 인증 실패 (username, password 불일치)
        if( !authentication.isAuthenticated() ) {
            log.info("인증 실패 : 아이디와 비밀번호가 일치하지 않습니다.");
            response.setStatus(401);
        }

        return authentication;
    }


    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain,
            Authentication authentication) throws IOException, ServletException {
        log.info("인증 성공 (auth SUCCESS) : ");

        CustomUser user = ((CustomUser) authentication.getPrincipal());
        int userNo = user.getUser().getUserNo();
        String userId = user.getUser().getId();

        // 권한 관련 코드 주석 처리
        /*
        List<String> roles = user.getAuthorities()
                                .stream()
                                .map(GrantedAuthority::getAuthority)
                                .collect(Collectors.toList());
        */

        // 🔐 JWT
        log.info("userNo: {}, userId: {}", userNo, userId);
        String token = jwtTokenProvider.createToken(userNo, userId); // createToken 메서드에서 roles를 제외한 형태로 사용

        // 💍 { Authorization : Bearer + {jwt} } 
        response.addHeader(SecurityConstants.TOKEN_HEADER, SecurityConstants.TOKEN_PREFIX + token);
        response.setStatus(200);
    }
}
