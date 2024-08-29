package com.yahobong.server.users.dto;

import java.util.Date;

import lombok.Data;

@Data
public class Users {
    private int userNo;
    private String id;
    private String pw;
    private String pwCheck;
    private String name;
    private String mail;
    private String phone;
    private String resetToken;    
    private Date resetTokenExpiry; 
 
    private int enabled; // 활성화 상태: 1 (활성화), 0 (비활성화) - 휴면 여부
    
    public Users() {
        
    }
    
    public Users(Users user) {
        this.userNo = user.getUserNo();
        this.id = user.getId();
        this.pw = user.getPw();
        this.name = user.getName();
        this.mail = user.getMail();
        this.phone = user.getPhone();
    }
}
