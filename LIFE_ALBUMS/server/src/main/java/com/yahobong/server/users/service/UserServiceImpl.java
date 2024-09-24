package com.yahobong.server.users.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.yahobong.server.users.dto.Users;
import com.yahobong.server.users.mapper.UserMapper;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public boolean login(Users user) throws Exception {
        String id = user.getId();
        String pw = user.getPw();

        Users dbUser = userMapper.login(id);

        if (dbUser == null || !passwordEncoder.matches(pw, dbUser.getPw())) {
            return false;
        }

        return true;
    }

    @Override
    public Users selectById(String id) throws Exception {
        return userMapper.selectById(id);
    }

    @Override
    public boolean checkId(String id) throws Exception {
        return userMapper.selectById(id) != null;
    }

    @Override
    public boolean checkMail(String mail) throws Exception {
        return userMapper.selectByEmail(mail) != null;
    }

    @Override
    public String findId(String name, String mail, String phone) throws Exception {
        String id = userMapper.findId(name, mail, phone);
        if (id == null) {
            throw new Exception("해당 정보로 등록된 사용자를 찾을 수 없습니다.");
        }
        return id;
    }

    @Override
    public int join(Users user) throws Exception {
        String encodedPassword = passwordEncoder.encode(user.getPw());
        user.setPw(encodedPassword);
        return userMapper.join(user);
    }

    @Override
    public void updatePw(Users user) throws Exception {
        String id = user.getId();
        String pw = user.getPw();
        userMapper.updatePw(id, pw);  // id와 암호화된 pw를 따로 전달
    }

    @Override
    public Users selectByEmail(String mail) throws Exception {
        return userMapper.selectByEmail(mail);
    }

    // 이름, 아이디, 이메일이 일치하는지 확인하는 메서드
    @Override
    public boolean verifyUserInfo(String name, String id, String mail) throws Exception {
        // UserMapper에서 해당 이름, 아이디, 이메일이 일치하는 사용자를 검색
        Users user = userMapper.verifyUserInfo(name, id, mail);  // 수정된 메서드 호출
        return user != null;  // 사용자가 있으면 true, 없으면 false 반환
    }
}
