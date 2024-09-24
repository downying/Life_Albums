package com.yahobong.server.users.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
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
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import com.yahobong.server.users.service.EmailService;
import com.yahobong.server.users.service.UserService;
import com.yahobong.server.users.dto.Users;
import com.yahobong.server.security.jwt.provider.JwtTokenProvider;
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
    private EmailService emailService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @GetMapping("/login")
    public String login(
        @CookieValue(value = "remember-id", required = false) Cookie cookie,
        Model model
    ) {
        String id = "";
        boolean rememberId = false;

        if (cookie != null) {
            id = cookie.getValue();
            rememberId = true;
        }

        model.addAttribute("id", id);
        model.addAttribute("rememberId", rememberId);
        return "/users/login";
    }

    @PostMapping("/login")
    @ResponseBody
    public ResponseEntity<?> handleLogin(@RequestBody Users loginRequest, HttpServletResponse response) {
        try {
            boolean loginSuccess = userService.login(loginRequest);

            if (loginSuccess) {
                Users loggedInUser = userService.selectById(loginRequest.getId());

                String accessToken = jwtTokenProvider.createToken(loggedInUser.getUserNo(), loggedInUser.getId());
                String refreshToken = jwtTokenProvider.createRefreshToken(loggedInUser.getUserNo(), loggedInUser.getId());

                Map<String, Object> responseBody = new HashMap<>();
                responseBody.put("userNo", loggedInUser.getUserNo());
                responseBody.put("username", loggedInUser.getId());
                responseBody.put("message", "Login successful");
                responseBody.put("accessToken", accessToken);
                responseBody.put("refreshToken", refreshToken);

                Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);
                refreshTokenCookie.setHttpOnly(true);
                refreshTokenCookie.setMaxAge(60 * 60 * 24 * 7);  // 7일간 유효
                refreshTokenCookie.setPath("/");
                response.addCookie(refreshTokenCookie);

                return ResponseEntity.ok().body(responseBody);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 실패: ID 또는 비밀번호가 올바르지 않습니다.");
            }
        } catch (Exception e) {
            log.error("로그인 실패: ", e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 실패: ID 또는 비밀번호가 올바르지 않습니다.");
        }
    }

    @GetMapping("/info")
    public ResponseEntity<?> userInfo(@AuthenticationPrincipal CustomUser customUser) {
        Users user = customUser.getUser();

        if (user != null) {
            return new ResponseEntity<>(user, HttpStatus.OK);
        }

        return new ResponseEntity<>("UNAUTHORIZED", HttpStatus.UNAUTHORIZED);
    }

    @GetMapping("/checkId")
    @ResponseBody
    public ResponseEntity<Map<String, Boolean>> checkDuplicateId(@RequestParam String id) throws Exception {
        boolean exists = userService.checkId(id);
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", exists);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/checkMail")
    @ResponseBody
    public ResponseEntity<Map<String, Boolean>> checkDuplicateEmail(@RequestParam String mail) throws Exception {
        boolean exists = userService.checkMail(mail);
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", exists);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/join")
    public ResponseEntity<?> join(@RequestBody Users user) throws Exception {
        if (userService.checkId(user.getId())) {
            return new ResponseEntity<>("이미 존재하는 아이디입니다.", HttpStatus.CONFLICT);
        }

        if (userService.checkMail(user.getMail())) {
            return new ResponseEntity<>("이미 존재하는 이메일입니다.", HttpStatus.CONFLICT);
        }

        int result = userService.join(user);
        if (result > 0) {
            return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("회원가입 실패", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/joinDone")
    public ResponseEntity<?> joinDone() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "회원가입이 완료되었습니다.");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

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

    // 이메일 인증번호 발송
    @PostMapping("/sendAuthCode")
    @ResponseBody
    public ResponseEntity<?> sendAuthCode(@RequestBody Map<String, String> userInfo) {
        String name = userInfo.get("name");
        String id = userInfo.get("id");
        String mail = userInfo.get("mail");

        try {
            log.info("이름: {}, 아이디: {}, 이메일: {}", name, id, mail);
            // 이름, 아이디, 이메일이 일치하는지 확인
            boolean isValid = userService.verifyUserInfo(name, id, mail);
            log.info("사용자 정보 일치 여부: {}", isValid);

            if (isValid) {
                // 인증번호 생성
                String authCode = generateAuthCode();
                log.info("생성된 인증번호: {}", authCode);

                // 이메일 발송
                emailService.sendSimpleMessage(mail, "인증 코드", "인증 코드: " + authCode);

                Map<String, String> response = new HashMap<>();
                response.put("message", "인증 코드가 이메일로 전송되었습니다.");
                response.put("authCode", authCode);  // 실제 서비스에서는 보안상 클라이언트로 인증 코드를 보내지 않음
                return new ResponseEntity<>(response, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("사용자 정보가 일치하지 않습니다.", HttpStatus.UNAUTHORIZED);
            }
        } catch (Exception e) {
            log.error("인증 코드 발송 중 오류: ", e);
            return new ResponseEntity<>("인증 코드 발송 중 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @PostMapping("/resetPassword")
    public ResponseEntity<?> resetPw(@RequestBody Users users) {
        String id = users.getId();
        String pw = users.getPw();
        String pwCheck = users.getPwCheck();

        if (!pw.equals(pwCheck)) {
            return new ResponseEntity<>("CHECKAGAIN", HttpStatus.OK);
        }

        try {
            Users user = userService.selectById(id);
            if (user != null) {
                BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
                user.setPw(passwordEncoder.encode(pw)); // 비밀번호 암호화 후 저장
                userService.updatePw(user); // 비밀번호 업데이트
                return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("비밀번호 재설정 중 오류가 발생했습니다.");
        }
    }

    @GetMapping("/resetPwComplete")
    public ResponseEntity<Map<String, String>> resetPwComplete() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "비밀번호 재설정이 완료되었습니다.");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    private String generateAuthCode() {
        Random random = new Random();
        int authCode = 100000 + random.nextInt(900000);
        return String.valueOf(authCode);
    }
}
