package com.yahobong.server.users.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.yahobong.server.users.dto.FileDTO;
import com.yahobong.server.users.mapper.FileMapper;

import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
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
    public FileDTO saveFile(MultipartFile file, FileDTO fileDto, String username) throws IOException {
        Path root = Paths.get(uploadPath);
        
        // 경로가 존재하지 않으면 디렉토리 생성
        if (!Files.exists(root)) {
            Files.createDirectories(root);
        }

        // 파일 이름 생성 및 경로 설정
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = root.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // 파일 경로 설정 후 데이터베이스에 저장
        fileDto.setFilePath("/upload/" + fileName);
        fileMapper.insertFile(fileDto);

        return fileDto;
    }

    @Transactional
    public List<FileDTO> getThumbnailsByAlbumNo(int albumsNo, int page, int size) {
        int offset = (page - 1) * size;
        log.info("앨범 번호: {}, Offset: {}, Size: {}", albumsNo, offset, size);
        return fileMapper.getThumbnailsByAlbumNo(albumsNo, offset, size);
    }

    @Transactional
    public List<FileDTO> getDateThumbnailsByDate(int albumsNo, int year, int month, int day) {
        // 해당 앨범 및 날짜의 사진을 가져옴
        List<FileDTO> photos = fileMapper.getDateThumbnailsByDate(albumsNo, year, month, day);
        
        // star가 있는 사진을 우선적으로 정렬
        return photos.stream()
            .sorted((a, b) -> {
                if (a.isStar() == b.isStar()) {
                    return Long.compare(a.getFileNo(), b.getFileNo());
                }
                return Boolean.compare(b.isStar(), a.isStar());
            })
            .collect(Collectors.toList());
    }

    @Transactional
    public List<FileDTO> getStarThumbnailsByAlbumNo(int albumsNo, int page, int size) {
        int offset = (page - 1) * size;
        return fileMapper.getStarThumbnailsByAlbumNo(albumsNo, offset, size);
    }

    @Transactional
    public int getTotalThumbnailCountByAlbumNo(int albumsNo) {
        return fileMapper.getTotalThumbnailCountByAlbumNo(albumsNo);
    }
    
    // 전체 앨범의 모든 파일 조회
    @Transactional
    public List<FileDTO> getAllPhotosByUser(int userNo, int page, int size) {
        int offset = (page - 1) * size; // 페이지네이션을 위한 오프셋 계산
        log.info("사용자 번호: {}, Offset: {}, Size: {}", userNo, offset, size);

        // 사용자의 모든 앨범에서 사진을 가져오기 위한 리스트
        List<FileDTO> allPhotos = fileMapper.getAllPhotosByUser(userNo, offset, size);

        return allPhotos;
    }

    // 사용자에 대한 전체 사진 개수를 가져오는 메소드
    @Transactional
    public int getTotalThumbnailCountByUser(int userNo) {
        return fileMapper.getTotalThumbnailCountByUser(userNo);
    }

    // 모달로 파일 조회
    @Transactional
    public FileDTO getFileByFileNo(int fileNo) {
        return fileMapper.getFileByFileNo(fileNo);
    }

    // 파일 수정
    @Transactional
    public void updateFile(FileDTO fileDto) {
        fileMapper.updateFile(fileDto);
    }

    // 파일 삭제
    @Transactional
    public void deleteFile(int fileNo) {
        fileMapper.deleteFile(fileNo);
    }

    // 즐겨찾기 상태 토글
    @Transactional
    public void toggleStar(int fileNo) {
        fileMapper.toggleStarByFileNo(fileNo);
    }

    // 캘린더로 보기 - 다운
    public List<FileDTO> getThumbnailsByUserAndDate(int userNo, int year, int month, int day) {
        System.out.println("Received request with userNo: " + userNo + ", year: " + year + ", month: " + month + ", day: " + day);
        return fileMapper.getThumbnailsByUserAndDate(userNo, year, month, day);
    }
}
