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

    public AlbumDTO createAlbum(AlbumDTO albumDTO) {
        albumMapper.insertAlbum(albumDTO);
        return albumDTO; // 방금 추가된 앨범을 반환
    }

    public List<AlbumDTO> findAlbumsByUserNo(int userNo) {
        return albumMapper.findAlbumsByUserNo(userNo);
    }
}
