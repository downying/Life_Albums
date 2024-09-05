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
    
    // 비밀번호 찾기 1. 인증번호 생성 및 저장
    public boolean generateResetToken(String id, String name, String mail, String resetToken) throws Exception;

    // 비밀번호 찾기 2. 인증번호 검증
    public boolean verifyResetToken(String id, String resetToken) throws Exception;

    // 비밀번호 찾기 3. 비밀번호 변경 페이지로 이동
    public boolean clearResetToken(String id, String resetToken) throws Exception;

    // 비밀번호 변경
    public boolean updatePw(String id, String pw) throws Exception;
}
