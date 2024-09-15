package com.yahobong.server.albums.dto;

import lombok.Data;

@Data
public class AlbumDTO {
    private int albumsNo;  // 앨범 번호
    private int userNo;    // 사용자 번호
    private String title;  // 앨범 제목

    // 기본 생성자
    public AlbumDTO() {}

    // 생성자
    public AlbumDTO(int albumsNo, int userNo, String title) {
        this.albumsNo = albumsNo;
        this.userNo = userNo;
        this.title = title;
    }


}
