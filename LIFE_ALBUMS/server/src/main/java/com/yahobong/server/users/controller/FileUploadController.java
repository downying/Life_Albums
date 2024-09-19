package com.yahobong.server.users.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.yahobong.server.users.dto.FileDTO;
import com.yahobong.server.users.service.FileService;

import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/fileApi")
public class FileUploadController {

    @Autowired
    private FileService fileService;

    @Autowired
    private ObjectMapper objectMapper;


    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadFile(
            @RequestPart("file") MultipartFile file,
            @RequestPart("data") String data) {


        try {
            FileDTO uploadDTO = objectMapper.readValue(data, FileDTO.class);
            log.info("Received data????: " + uploadDTO);
            FileDTO savedFile = fileService.saveFile(file, uploadDTO);
            return ResponseEntity.ok(savedFile);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("파일 업로드 중 오류 발생: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("잘못된 요청: " + e.getMessage());
        }
    }

    @GetMapping("/thumbnails/{albumsNo}")
    public ResponseEntity<Map<String, Object>> getThumbnailsByAlbumNo(
            @PathVariable int albumsNo,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "2") int size) {

        List<FileDTO> thumbnails = fileService.getThumbnailsByAlbumNo(albumsNo, page, size);
        int totalCount = fileService.getTotalThumbnailCountByAlbumNo(albumsNo);
        // 페이지를 size로 나눔 size = 한 화면에 뜨는 앨범
        int totalPages = (int) Math.ceil((double) totalCount / size);

        Map<String, Object> response = new HashMap<>();
        response.put("thumbnails", thumbnails);
        response.put("currentPage", page);
        response.put("totalItems", totalCount);
        response.put("totalPages", totalPages);

        return ResponseEntity.ok(response);
    }

    // 특정 fileNo로 파일 정보 가져오기
    @GetMapping("/{fileNo}")
    public ResponseEntity<FileDTO> getFile(@PathVariable int fileNo) {
        FileDTO file = fileService.getFileByFileNo(fileNo);
        return new ResponseEntity<>(file, HttpStatus.OK);
    }

    // 파일 수정
    @PutMapping("/{fileNo}")
    public ResponseEntity<?> updateFile(@PathVariable int fileNo, @RequestBody FileDTO fileDto) {
        fileDto.setFileNo(fileNo);
        fileService.updateFile(fileDto);
        return ResponseEntity.ok("파일이 수정되었습니다.");
    }

    // 파일 삭제
    @DeleteMapping("/{fileNo}")
    public ResponseEntity<?> deleteFile(@PathVariable int fileNo) {
        fileService.deleteFile(fileNo);
        return ResponseEntity.ok("파일이 삭제되었습니다.");
    }

}