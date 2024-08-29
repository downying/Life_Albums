package com.yahobong.server.security.jwt.provider;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.yahobong.server.users.dto.CustomUser;
import com.yahobong.server.users.dto.Users;
import com.yahobong.server.users.mapper.UserMapper;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class CustomUserDetailService implements UserDetailsService {

    @Autowired
    private UserMapper userMapper;

    @Override
    public UserDetails loadUserByUsername(String id)  {
        log.info("login - id : " + id);
        log.info(":::::::::: 커스텀 ::::::::::");
        log.info("- 사용자 정의 인증을 위해, 사용자 정보 조회");
        log.info("- userId : " + id);
        // MyBatis를 사용하여 데이터베이스에서 사용자 세부 정보를 가져옵니다.
        Users user = userMapper.login(id);

        if (user == null) {
            log.info("사용자 없음...");
            throw new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + id);
        }
        log.info("user :::::");
        log.info(user.toString());
        // 🟢🟡🔴 CustomUser (➡User) 사용
        CustomUser customUser = new CustomUser(user);

        log.info("customuser :::::");
        log.info(customUser.toString());
        return customUser;

    }
}