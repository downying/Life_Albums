package com.yahobong.server.users.service;

import org.springframework.beans.factory.annotation.Value;
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
import java.util.List;

@Service
public class FileService {

    // 경로를 properties에서 가져옴
    @Value("${upload.path}")
    private String uploadPath;

    private final FileMapper fileMapper;

    public FileService(FileMapper fileMapper) {
        this.fileMapper = fileMapper;
    }

    @Transactional
    public FileDTO saveFile(MultipartFile file, FileDTO fileDto) throws IOException {
        // 파일 저장 경로 설정 (필요시 다중 경로 처리 가능)
        String[] paths = uploadPath.split(",");
        Path root = Paths.get(paths[0]); // 첫 번째 경로 사용

        // 파일 이름 생성
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        
        // 파일 저장
        Path filePath = root.resolve(fileName);
        Files.copy(file.getInputStream(), root.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);

         // filePath 설정
        fileDto.setFilePath(filePath.toString());

        // 파일 정보를 데이터베이스에 저장
        fileMapper.insertFile(fileDto);

        return fileDto;
    }

    @Transactional
    public List<FileDTO> getThumbnailsByAlbumNo(int albumsNo, int page, int size) {
        int offset = (page - 1) * size;
        return fileMapper.getThumbnailsByAlbumNo(albumsNo, offset, size);
    }

    @Transactional
    public int getTotalThumbnailCountByAlbumNo(int albumsNo) {
        return fileMapper.getTotalThumbnailCountByAlbumNo(albumsNo);
    }
}
