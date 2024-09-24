package com.yahobong.server.users.service;

import com.yahobong.server.users.dto.Users;

public interface UserService {
    
    // 로그인
    public boolean login(Users user) throws Exception;

    // 회원 조회 - id
    public Users selectById(String id) throws Exception;

    // 회원 조회 - 이메일
    public Users selectByEmail(String mail) throws Exception;

    // 회원 가입
    public int join(Users user) throws Exception;

    // 아이디 중복 체크
    public boolean checkId(String id) throws Exception;

    // 이메일 중복 체크
    public boolean checkMail(String mail) throws Exception;

    // 아이디 찾기
    public String findId(String name, String mail, String phone) throws Exception;

    // 이름, 아이디, 이메일이 일치하는지 확인하는 메서드
    public boolean verifyUserInfo(String name, String id, String mail) throws Exception;

    // 비밀번호 업데이트
    public void updatePw(Users user) throws Exception;
}
