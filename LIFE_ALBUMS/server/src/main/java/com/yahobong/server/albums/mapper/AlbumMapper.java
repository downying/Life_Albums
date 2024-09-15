package com.yahobong.server.albums.mapper;

import com.yahobong.server.albums.dto.AlbumDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AlbumMapper {
    // 사용자별 앨범 조회
    public List<AlbumDTO> findAlbumsByUserNo(int userNo);
   
    // 앨범 삽입
    public void insertAlbum(AlbumDTO albumDTO);

    // 앨범 제목 수정
    public void updateAlbumTitle(@Param("albumsNo") int albumsNo, @Param("title") String title);

    // 앨범 삭제 
    public void deleteAlbum(@Param("albumsNo") int albumsNo);
}

