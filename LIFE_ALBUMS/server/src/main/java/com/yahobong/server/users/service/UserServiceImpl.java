package com.yahobong.server.users.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.yahobong.server.users.dto.CustomUser;
import com.yahobong.server.users.dto.Users;
import com.yahobong.server.users.mapper.UserMapper;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class UserServiceImpl implements UserService{
    
    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    /**
     * 로그인
     */
    @Override
    public boolean login(Users user) throws Exception {
        String id = user.getId();
        String pw = user.getPw();

        // 아이디, 비밀번호 인증 토큰 생성
        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(id, pw);
        
        try {
            // 토큰을 이용하여 인증
            Authentication authentication = authenticationManager.authenticate(token);
            
            // 인증된 사용자 확인
            CustomUser loginUser = (CustomUser) authentication.getPrincipal();
            log.info("인증된 사용자 아이디 : " + loginUser.getUser().getId());
            
            // 시큐리티 컨텍스트에 등록
            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            // 토큰에 요청정보를 등록
            // token.setDetails( new WebAuthenticationDetails(requset) );

            // 토큰을 이용하여 인증(로그인)
            // Authentication authentication = authenticationManager.authenticate(token);

    
            // 클라이언트에게 JWT 토큰 반환 (헤더 설정 등)
            // 예: HttpServletResponse response를 이용하여 설정
            // response.setHeader("Authorization", "Bearer " + jwtToken);
            
            return true;
        } catch (Exception e) {
            log.error("로그인 실패: " + e.getMessage());
            return false;
        }
    }
        

    /**
     * 회원 가입
     */
    @Override
    public int join(Users user) throws Exception {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'join'");
    }

    @Override
    public boolean checkId(String id) throws Exception {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'checkId'");
    }

    @Override
    public boolean checkMail(String mail) throws Exception {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'checkMail'");
    }

    @Override
    public String findId(String name, String mail, String phone) throws Exception {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'findId'");
    }

    @Override
    public boolean generateResetToken(String id, String name, String mail, String resetToken) throws Exception {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'generateResetToken'");
    }

    @Override
    public boolean verifyResetToken(String id, String resetToken) throws Exception {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'verifyResetToken'");
    }

    @Override
    public boolean clearResetToken(String id, String resetToken) throws Exception {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'clearResetToken'");
    }

    @Override
    public boolean updatePw(String id, String pw) throws Exception {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'updatePw'");
    }
    
}
