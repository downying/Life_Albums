package com.yahobong.server.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.yahobong.server.security.LoginSuccessHandler;
import com.yahobong.server.security.jwt.filter.JwtAuthenticationFilter;
import com.yahobong.server.security.jwt.filter.JwtRequestFilter;
import com.yahobong.server.security.jwt.provider.CustomUserDetailService;
import com.yahobong.server.security.jwt.provider.JwtTokenProvider;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true, securedEnabled = true)
public class SecurityConfig {

    @Autowired
    private LoginSuccessHandler loginSuccessHandler;

    @Autowired 
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private CustomUserDetailService customUserDetailService;

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        log.info("Configuring security settings...");

        AuthenticationManager authenticationManager = authenticationManager(http.getSharedObject(AuthenticationConfiguration.class));

        // 폼 기반 로그인 비활성화
        http.formLogin().disable();

        // HTTP 기본 인증 비활성화
        http.httpBasic().disable();

        // CSRF 비활성화
        http.csrf().disable();

        // JWT 필터 설정
        http.addFilterAt(new JwtAuthenticationFilter(authenticationManager, jwtTokenProvider), UsernamePasswordAuthenticationFilter.class)
            .addFilterBefore(new JwtRequestFilter(authenticationManager, jwtTokenProvider), UsernamePasswordAuthenticationFilter.class);

        // 권한 및 인가 설정
        http.authorizeRequests()
        .antMatchers("/", "/login", "/users/login", "/users/findId", "/users/join", "/users/checkId", "/users/checkMail", "/fileApi/upload", "/findIdResult").permitAll()  // 회원가입, 로그인 및 중복 확인 경로 허용
        .antMatchers("/albums/**").authenticated()  // 인증된 사용자만 /api/albums/** 경로에 접근 허용
        .anyRequest().authenticated();  // 그 외의 모든 요청은 인증 필요

        // 사용자 정보를 불러오는 서비스 설정
        http.userDetailsService(customUserDetailService);

        return http.build();
    }

    @Bean
    public AuthenticationSuccessHandler authenticationSuccessHandler() {
        return new LoginSuccessHandler(jwtTokenProvider);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
