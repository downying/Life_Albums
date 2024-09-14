package com.yahobong.server.albums.dto;

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

    // Getter와 Setter
    public int getAlbumsNo() {
        return albumsNo;
    }

    public void setAlbumsNo(int albumsNo) {
        this.albumsNo = albumsNo;
    }

    public int getUserNo() {
        return userNo;
    }

    public void setUserNo(int userNo) {
        this.userNo = userNo;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
