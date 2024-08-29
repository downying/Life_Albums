package com.yahobong.server.users.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.yahobong.server.users.dto.Users;

@Mapper
public interface UserMapper {

    // 로그인
    public Users login(String id);

    // 회원 가입
    public int join(Users user) throws Exception;

    // 아이디 중복 체크
    public Integer checkId(@Param("id") String id) throws Exception;

    // 이메일 중복 체크
    public Integer checkMail(@Param("mail") String mail) throws Exception;

    // 아이디 찾기
    public String findId(@Param("name") String name, @Param("mail") String mail, @Param("phone") String phone) throws Exception;

    // 비밀번호 찾기 1. 인증번호 생성 및 저장
    int generateResetToken(@Param("id") String id, @Param("name") String name, @Param("mail") String mail, @Param("resetToken") String resetToken) throws Exception;

    // 비밀번호 찾기 2. 인증번호 검증
    int verifyResetToken(@Param("id") String id, @Param("resetToken") String resetToken) throws Exception;

    // 비밀번호 찾기 3. 비밀번호 변경 페이지로 이동
    int clearResetToken(@Param("id") String id, @Param("resetToken") String resetToken) throws Exception;

    // 비밀번호 변경
    int updatePw(@Param("id") String id, @Param("pw") String pw) throws Exception;

}
