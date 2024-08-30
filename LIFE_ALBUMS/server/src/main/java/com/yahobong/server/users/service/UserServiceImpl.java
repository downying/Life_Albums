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

        log.info("로그인 시도 - ID: " + id);

        // DB에서 사용자 정보 로드 (userMapper의 로그인 쿼리를 호출)
        Users dbUser = userMapper.login(id);  // ID만으로 사용자 정보 조회
        
        // 사용자 존재 여부 확인
        if (dbUser == null) {
            log.error("사용자를 찾을 수 없습니다. ID: " + id);
            return false;
        }

        log.info("DB에 저장된 암호화된 비밀번호: " + dbUser.getPw());

        // 입력된 비밀번호와 DB에 저장된 암호화된 비밀번호 비교
        if (!passwordEncoder.matches(pw, dbUser.getPw())) {
            log.error("비밀번호가 일치하지 않습니다.");
            return false;
        }

        // 인증 성공
        log.info("인증 성공 - ID: " + id);
        return true;
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
