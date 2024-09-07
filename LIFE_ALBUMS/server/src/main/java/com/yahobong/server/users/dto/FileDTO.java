package com.yahobong.server.users.dto;

import lombok.Data;

@Data
public class FileDTO {
    private int fileNo;
    private int albumsNo;
    private String content;
    private int year;
    private int month;
    private int day;
    private int star;
    private String filePath;
    private String regDate;

    // Getters and setters
}
