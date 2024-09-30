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
            @RequestPart("data") String data,
            @RequestPart("username") String username) {

        try {
            // 로그 추가
            log.info("Received file: " + file.getOriginalFilename());
            log.info("Received data: " + data);
            log.info("Received username: " + username);

            // data를 FileDTO로 변환
            FileDTO fileDto = objectMapper.readValue(data, FileDTO.class);

            // albumsNo가 null일 경우 예외 처리
            if (fileDto.getAlbumsNo() <= 0) {
                return ResponseEntity.badRequest().body("앨범 번호(albumsNo)는 필수입니다.");
            }

            // 파일 저장 처리
            FileDTO savedFile = fileService.saveFile(file, fileDto, username);
            return ResponseEntity.ok(savedFile);
        } catch (IOException e) {
            log.error("파일 업로드 중 오류 발생: ", e);
            return ResponseEntity.internalServerError().body("파일 업로드 중 오류 발생: " + e.getMessage());
        } catch (Exception e) {
            log.error("잘못된 요청: ", e); // 예외 로그를 추가하여 이유를 확인
            return ResponseEntity.badRequest().body("잘못된 요청: " + e.getMessage());
        }
    }

    @GetMapping("/thumbnails/{albumNo}")
    public ResponseEntity<Map<String, Object>> getThumbnailsByAlbumNo(
            @PathVariable("albumNo") int albumNo,  // albumNo가 경로에 제대로 포함되는지 확인
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "2") int size) {
        
        log.info("Controller에서 받은 albumNo: {}", albumNo);  // albumNo 로그로 확인
        List<FileDTO> thumbnails = fileService.getThumbnailsByAlbumNo(albumNo, page, size);
        
        // 썸네일 갯수 로그
        int totalCount = fileService.getTotalThumbnailCountByAlbumNo(albumNo);
        log.info("총 썸네일 개수: {}", totalCount);
        
        Map<String, Object> response = new HashMap<>();
        response.put("thumbnails", thumbnails);
        response.put("totalItems", totalCount);

        return ResponseEntity.ok(response);
    }


    // 캘린더 아이콘 data로 thumbnail
    @GetMapping("/dateThumbnails/{albumNo}")
    public ResponseEntity<?> getDataThumbnails(
            @PathVariable int albumNo,
            @RequestParam int year,
            @RequestParam int month,
            @RequestParam int day,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "2") int size) {

        log.info("Year: {}, Month: {}, Day: {}", year, month, day);

        List<FileDTO> thumbnails = fileService.getDateThumbnailsByAlbumNo(albumNo, page, size, year, month, day);
        int totalCount = fileService.getTotalThumbnailCountByAlbumNo(albumNo);
        int totalPages = (int) Math.ceil((double) totalCount / size);

        Map<String, Object> response = new HashMap<>();
        response.put("thumbnails", thumbnails);
        response.put("currentPage", page);
        response.put("totalItems", totalCount);
        response.put("totalPages", totalPages);
        
        return ResponseEntity.ok(response);
    }

    // 캘린더 아이콘 data로 star 1 인 thumnail
    @GetMapping("/starThumbnails/{albumNo}")
    public ResponseEntity<?> getStarThumbnails(
            @PathVariable int albumNo,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "2") int size) {


        List<FileDTO> thumbnails = fileService.getStarThumbnailsByAlbumNo(albumNo, page, size);
        int totalCount = fileService.getTotalThumbnailCountByAlbumNo(albumNo);
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

    // 전체 앨범
    @GetMapping("/photos/{userNo}")
    public ResponseEntity<Map<String, Object>> getAllPhotos(
            @PathVariable int userNo,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "2") int size) {
        
        log.info("Controller에서 받은 userNo: {}", userNo);

        // 사용자의 모든 사진 조회
        List<FileDTO> photos = fileService.getAllPhotosByUser(userNo, page, size);
        
        // 총 카운트 조회
        int totalCount = fileService.getTotalThumbnailCountByUser(userNo);
        int totalPages = (int) Math.ceil((double) totalCount / size);
        
        // 로그 추가
        log.info("총 사진 수: {}", totalCount);
        log.info("현재 페이지: {}, 페이지당 아이템 수: {}", page, size);
        log.info("반환된 사진 수: {}", photos.size()); // 반환된 사진 수 로그

        Map<String, Object> response = new HashMap<>();
        response.put("photos", photos);
        response.put("currentPage", page);
        response.put("totalItems", totalCount);
        response.put("totalPages", totalPages);

        return ResponseEntity.ok(response);
    }

}