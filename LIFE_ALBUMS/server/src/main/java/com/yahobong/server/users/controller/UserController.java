package com.yahobong.server.users.controller;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.ui.Model;

import com.yahobong.server.users.service.UserService;
import com.yahobong.server.users.dto.Users;
import com.yahobong.server.users.dto.CustomUser;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.RequestParam;


@Slf4j
@Controller
@CrossOrigin(origins = "*")
@RequestMapping("/users")
public class UserController {
    
    @Autowired
    private UserService userService;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @GetMapping("/login")
    public String login(
        @CookieValue(value = "remember-id", required = false) Cookie cookie,
        Model model
    ) {
        log.info("로그인...");

        String id = "";                 // 저장된 아이디
        boolean rememberId = false;     // 아이디 저장 체크 여부

        if (cookie != null) {
            log.info("CookieName : " + cookie.getName());
            log.info("CookieValue : " + cookie.getValue());
            id = cookie.getValue();
            rememberId = true;
        }

        model.addAttribute("id", id);  // 'id'를 모델에 추가
        model.addAttribute("rememberId", rememberId);  // 'rememberId'를 모델에 추가
        return "/users/login";  // 로그인 페이지의 뷰 이름 반환
    }

    @PostMapping("/login")
    @ResponseBody
    public ResponseEntity<?> handleLogin(@RequestBody Users loginRequest, HttpServletResponse response) {
        try {
            boolean loginSuccess = userService.login(loginRequest);

            if (loginSuccess) {
                return ResponseEntity.ok().body("Login successful");
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 실패: ID 또는 비밀번호가 올바르지 않습니다.");
            }
        } catch (Exception e) {
            log.error("로그인 실패: ", e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 실패: ID 또는 비밀번호가 올바르지 않습니다.");
        }
    }

    /**
     * 사용자 정보 조회
     * @param customUser
     * @return
     */
    @GetMapping("/info")
    public ResponseEntity<?> userInfo(@AuthenticationPrincipal CustomUser customUser) {
        
        log.info("::::: customUser :::::");
        log.info("customUser : "+ customUser);

        Users user = customUser.getUser();
        log.info("user : " + user);

        // 인증된 사용자 정보 
        if( user != null ) {
            log.info("인증성공");
            return new ResponseEntity<>(user, HttpStatus.OK);
        }

        // 인증 되지 않음
        return new ResponseEntity<>("UNAUTHORIZED", HttpStatus.UNAUTHORIZED);
    }
    
}
