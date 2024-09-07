package com.yahobong.server.users.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.yahobong.server.users.dto.FileDTO;
import com.yahobong.server.users.service.FileService;

import lombok.extern.slf4j.Slf4j;

import java.io.IOException;

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
}