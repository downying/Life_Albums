package com.yahobong.server.users.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.yahobong.server.users.dto.FileDTO;
import com.yahobong.server.users.mapper.FileMapper;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class FileService {

    // 각자 Path 적어야됨 맥이라 일케함
    private final Path root = Paths.get("/Users/apnalchangchanghongjunbeom/upload");

    @Autowired
    private FileMapper fileMapper;

    @Transactional
    public FileDTO saveFile(MultipartFile file, FileDTO fileDto) throws IOException {
        // 파일 저장
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Files.copy(file.getInputStream(), this.root.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);

        // 파일 정보를 데이터베이스에 저장
        fileMapper.insertFile(fileDto);

        return fileDto;
    }
}