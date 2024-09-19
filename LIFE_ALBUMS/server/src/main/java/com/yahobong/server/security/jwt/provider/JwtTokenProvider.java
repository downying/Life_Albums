package com.yahobong.server.security.jwt.provider;

import java.util.Date;
import java.util.Collections;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.yahobong.server.prop.JwtProps;
import com.yahobong.server.users.dto.CustomUser;
import com.yahobong.server.users.dto.Users;
import com.yahobong.server.users.mapper.UserMapper;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class JwtTokenProvider {

    @Autowired
    private JwtProps jwtProps;

    @Autowired
    private UserMapper userMapper;

    /*
     * 👩‍💼➡🔐 accessToken 생성 메소드
     */
    public String createToken(int userNo, String id) {
        byte[] signingKey = getSigningKey();
    
        // JWT accessToken 생성
        return Jwts.builder()
            .setSubject(id)  // 사용자 ID를 주제로 설정
            .claim("uno", userNo)  // 사용자 번호 클레임 추가
            .claim("uid", id)  // 사용자 ID 클레임 추가
            .setExpiration(new Date(System.currentTimeMillis() + 86400000))  // 만료 시간 설정 (1일)
            .signWith(Keys.hmacShaKeyFor(signingKey), SignatureAlgorithm.HS512)  // 서명 설정
            .compact();
    }

    /*
     * 🔐➡ refreshToken 생성 메소드 (새로 추가)
     */
    public String createRefreshToken(int userNo, String id) {
        byte[] signingKey = getSigningKey();
        
        // JWT refreshToken 생성
        return Jwts.builder()
            .setSubject(id)  // 사용자 ID를 주제로 설정
            .claim("uno", userNo)  // 사용자 번호 클레임 추가
            .setExpiration(new Date(System.currentTimeMillis() + 864000000))  // 만료 시간 설정 (현재 10일)
            .signWith(Keys.hmacShaKeyFor(signingKey), SignatureAlgorithm.HS512)  // 서명 설정
            .compact();
    }
    
    /**
     * 🔐➡👩‍💼 토큰 해석
     * 
     * Authorization : Bearer + {jwt}  (authHeader)
     * ➡ jwt 추출 
     * ➡ UsernamePasswordAuthenticationToken
     * @param authHeader
     * @return
     * @throws Exception
     */
    public UsernamePasswordAuthenticationToken getAuthentication(String authHeader) {
        log.info("토큰 해석");
        if(authHeader == null || authHeader.length() == 0 ) 
            return null;

        try {
            // jwt 추출 
            String jwt = authHeader.replace("Bearer ", "");

            // 🔐➡👩‍💼 JWT 파싱
            Jws<Claims> parsedToken = Jwts.parser()
                                            .verifyWith(getShaKey())
                                            .build()
                                            .parseSignedClaims(jwt);  

            log.info("parsedToken : " + parsedToken);

            // 인증된 사용자 번호
            String userNo = parsedToken.getPayload().get("uno").toString();
            int no = (userNo == null ? 0 : Integer.parseInt(userNo));
            log.info("userNo : " + userNo);

            // 인증된 사용자 아이디
            String userId = parsedToken.getPayload().get("uid").toString();
            log.info("userId : " + userId);

            // 토큰에 userId 있는지 확인
            if(userId == null || userId.length() == 0) {
                return null;
            }

            Users user = new Users();
            user.setUserNo(no);
            user.setId(userId);

            // 토큰 유효하면 DB에서 추가 정보 가져오기
            try {
                Users userInfo = userMapper.login(userId);
                if(userInfo != null) {
                    user.setId(userInfo.getId());   
                    user.setName(userInfo.getName());
                    user.setMail(userInfo.getMail());
                    user.setPhone(userInfo.getPhone());
                }
            } catch (Exception e) {
                log.error(e.getMessage());
                log.error("토큰 유효 -> DB 추가 정보 조회시 에러 발생...");
            }

            UserDetails userDetails = new CustomUser(user);
            return new UsernamePasswordAuthenticationToken(userDetails, null, Collections.emptyList());

        } catch (ExpiredJwtException exception) {
            log.warn("Request to parse expired JWT : {} failed : {}", authHeader, exception.getMessage());
        } catch (UnsupportedJwtException exception) {
            log.warn("Request to parse unsupported JWT : {} failed : {}", authHeader, exception.getMessage());
        } catch (MalformedJwtException exception) {
            log.warn("Request to parse invalid JWT : {} failed : {}", authHeader, exception.getMessage());
        } catch (IllegalArgumentException exception) {
            log.warn("Request to parse empty or null JWT : {} failed : {}", authHeader, exception.getMessage());
        }

        return null;
    }


    /**
     * 🔐❓ 토큰 유효성 검사
     * @param jwt
     * @return
     *  ⭕ true     : 유효
     *  ❌ false    : 만료
     */
    public boolean validateToken(String jwt) {
        try {
            // 🔐➡👩‍💼 JWT 파싱
            Jws<Claims> claims = Jwts.parser()
                                     .verifyWith(getShaKey())
                                     .build()
                                     .parseSignedClaims(jwt);

            log.info("::::: 토큰 만료기간 :::::");
            log.info("-> " + claims.getPayload().getExpiration());
            
            return !claims.getPayload().getExpiration().before(new Date()); // 만료 여부 판단
        } catch (ExpiredJwtException exception) {
            log.error("Token Expired");  // 토큰 만료 
            return false;
        } catch (JwtException exception) {
            log.error("Token Tampered");  // 토큰 손상
            return false;
        } catch (NullPointerException exception) {
            log.error("Token is null");  // 토큰 없음
            return false;
        } catch (Exception e) {
            return false;
        }
    }

    // secretKey ➡ signingKey
    private byte[] getSigningKey() {
        return jwtProps.getSecretKey().getBytes();
    }

    // secretKey ➡ (HMAC-SHA algorithms) ➡ signingKey
    private SecretKey getShaKey() {
        return Keys.hmacShaKeyFor(getSigningKey());
    }
}
