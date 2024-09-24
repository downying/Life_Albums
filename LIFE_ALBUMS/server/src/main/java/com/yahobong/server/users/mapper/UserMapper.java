package com.yahobong.server.users.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.yahobong.server.users.dto.Users;

@Mapper
public interface UserMapper {

    // 로그인
    public Users login(@Param("id") String id);

    // 회원 조회 - id
    public Users selectById(String id) throws Exception;

    // 회원 조회 - 이메일
    public Users selectByEmail(String mail) throws Exception;

    // 회원 가입
    public int join(Users user) throws Exception;

    // 아이디 중복 체크
    public Integer checkId(@Param("id") String id) throws Exception;

    // 이메일 중복 체크
    public Integer checkMail(@Param("mail") String mail) throws Exception;

    // 아이디 찾기
    public String findId(@Param("name") String name, @Param("mail") String mail, @Param("phone") String phone) throws Exception;

    // 비밀번호 변경
    int updatePw(@Param("id") String id, @Param("pw") String pw) throws Exception;

    // 이름, 아이디, 이메일을 기반으로 사용자 정보 검증
    public Users verifyUserInfo(@Param("name") String name, @Param("id") String id, @Param("mail") String mail) throws Exception;
}
