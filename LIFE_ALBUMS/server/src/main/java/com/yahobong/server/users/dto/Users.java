package com.yahobong.server.users.dto;

import java.util.Date;

import lombok.Data;

@Data
public class Users {
    private int userNo;
    private String id;
    private String pw;
    private String name;
    private String mail;
    private int phone;
    private String resetToken;    
    private Date resetTokenExpiry; 
    
}
