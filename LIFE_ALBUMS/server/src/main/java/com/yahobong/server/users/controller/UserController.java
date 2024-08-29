package com.yahobong.server.users.controller;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
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

import io.jsonwebtoken.lang.Collections;

import com.yahobong.server.users.dto.Users;
import com.yahobong.server.users.dto.CustomUser;

import lombok.extern.slf4j.Slf4j;

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

}