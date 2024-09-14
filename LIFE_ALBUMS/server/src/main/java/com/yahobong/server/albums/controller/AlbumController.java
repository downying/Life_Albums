package com.yahobong.server.albums.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.yahobong.server.albums.dto.AlbumDTO;
import com.yahobong.server.albums.service.AlbumService;

import lombok.extern.slf4j.Slf4j;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/albums")  // 최상위 경로 설정
@CrossOrigin(origins = "*")
public class AlbumController {

    @Autowired
    private AlbumService albumService;

    // 특정 유저의 앨범 조회
    @GetMapping("/users/{userNo}")  
    public ResponseEntity<List<AlbumDTO>> getAlbumsByUserNo(@PathVariable("userNo") int userNo) {
        try {
            List<AlbumDTO> albums = albumService.findAlbumsByUserNo(userNo);
            return ResponseEntity.ok(albums);
        } catch (Exception e) {
            log.error("앨범 조회 중 오류 발생: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // 앨범 생성
    @PostMapping("/create")  // 경로 추가
    public ResponseEntity<AlbumDTO> createAlbum(@RequestBody AlbumDTO albumDto) {
        try {
            AlbumDTO createdAlbum = albumService.createAlbum(albumDto);
            return ResponseEntity.ok(createdAlbum);
        } catch (Exception e) {
            log.error("앨범 생성 중 오류 발생: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    
}
