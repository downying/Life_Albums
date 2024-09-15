package com.yahobong.server.albums.service;

import com.yahobong.server.albums.dto.AlbumDTO;
import com.yahobong.server.albums.mapper.AlbumMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AlbumService {
    @Autowired
    private AlbumMapper albumMapper;

    // 사용자 별 앨범 조회
    public List<AlbumDTO> findAlbumsByUserNo(int userNo) {
        return albumMapper.findAlbumsByUserNo(userNo);
    }

    // 앨범 생성
    public AlbumDTO createAlbum(AlbumDTO albumDTO) {
        albumMapper.insertAlbum(albumDTO);
        return albumDTO;
    }

    // 앨범 제목 업데이트
    public AlbumDTO updateAlbumTitle(int albumsNo, AlbumDTO albumDTO) {
        albumMapper.updateAlbumTitle(albumsNo, albumDTO.getTitle());
        return albumDTO;
    }

    // 앨범 삭제
    public void deleteAlbum(int albumsNo) {
        albumMapper.deleteAlbum(albumsNo);
    }

}

