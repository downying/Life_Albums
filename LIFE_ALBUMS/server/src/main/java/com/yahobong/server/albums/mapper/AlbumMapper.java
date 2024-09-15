package com.yahobong.server.albums.mapper;

import com.yahobong.server.albums.dto.AlbumDTO;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface AlbumMapper {

    // 앨범을 삽입하는 메서드
    void insertAlbum(AlbumDTO albumDTO);

    // 사용자 번호로 앨범을 조회하는 메서드
    List<AlbumDTO> findAlbumsByUserNo(int userNo);  // 이 부분 추가
}
