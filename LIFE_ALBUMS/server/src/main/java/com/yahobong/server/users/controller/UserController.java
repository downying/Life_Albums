package com.yahobong.server.users.controller;

import java.util.HashMap;
import java.util.Map;

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
                Users loggedInUser = userService.selectById(loginRequest.getId()); // 로그인한 사용자 정보 조회

                // 로그인 성공 시 userNo와 기타 사용자 정보를 반환
                Map<String, Object> responseBody = new HashMap<>();
                responseBody.put("userNo", loggedInUser.getUserNo());
                responseBody.put("username", loggedInUser.getId());
                responseBody.put("message", "Login successful");

                return ResponseEntity.ok().body(responseBody);
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

    // 아이디 중복 확인
    @GetMapping("/checkId")
    @ResponseBody
    public ResponseEntity<Map<String, Boolean>> checkDuplicateId(@RequestParam String id) throws Exception {
        boolean exists = userService.checkId(id);
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", exists);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // 이메일 중복 확인
    @GetMapping("/checkMail")
    @ResponseBody
    public ResponseEntity<Map<String, Boolean>> checkDuplicateEmail(@RequestParam String mail) throws Exception {
        boolean exists = userService.checkMail(mail);
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", exists);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * 회원가입
     * @param user
     * @return
     * @throws Exception
     */
    @PostMapping("/join")
    public ResponseEntity<?> join(@RequestBody Users user) throws Exception {
        log.info("[POST] - /users/join");

        // 이미 존재하는 아이디 및 이메일 확인
        if (userService.checkId(user.getId())) {
            log.info("이미 존재하는 아이디: {}", user.getId());
            return new ResponseEntity<>("이미 존재하는 아이디입니다.", HttpStatus.CONFLICT); // 409 Conflict
        }

        if (userService.checkMail(user.getMail())) {
            log.info("이미 존재하는 이메일: {}", user.getMail());
            return new ResponseEntity<>("이미 존재하는 이메일입니다.", HttpStatus.CONFLICT); // 409 Conflict
        }

        // 회원가입 처리
        int result = userService.join(user);
        if (result > 0) {
            log.info("회원가입 성공! - SUCCESS");
            return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
        } else {
            log.info("회원가입 실패! - FAIL");
            return new ResponseEntity<>("회원가입 실패", HttpStatus.BAD_REQUEST);
        }
    }




    // 회원가입 완료 페이지 또는 후처리
    @GetMapping("/joinDone")
    public ResponseEntity<?> joinDone() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "회원가입이 완료되었습니다.");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // ID 찾기
    @GetMapping("/findId")
    public ResponseEntity<?> findId(@RequestParam String name, @RequestParam String mail, @RequestParam String phone) {
        try {
            String id = userService.findId(name, mail, phone);
            Map<String, String> response = new HashMap<>();
            response.put("id", id);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
    
    
}
