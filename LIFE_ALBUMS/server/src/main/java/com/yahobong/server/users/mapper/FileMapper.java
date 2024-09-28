package com.yahobong.server.users.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.transaction.annotation.Transactional;

import com.yahobong.server.users.dto.FileDTO;

@Mapper
public interface FileMapper {

    // 파일 등록
    void insertFile(FileDTO fileDTO);

    // f.userNo = a.userNo f*
    List<FileDTO> getThumbnailsByAlbumNo(@Param("albumsNo") int albumsNo, @Param("offset") int offset,
            @Param("limit") int limit);

    List<FileDTO> getDateThumbnailsByAlbumNo(@Param("albumsNo") int albumsNo, @Param("offset") int offset,
            @Param("limit") int limit, @Param("year") int year, @Param("month") int month, @Param("day") int day);

    List<FileDTO> getStarThumbnailsByAlbumNo(@Param("albumsNo") int albumsNo, @Param("offset") int offset,
            @Param("limit") int limit);

    // f.userNo = a.userNo COUNT(*)
    int getTotalThumbnailCountByAlbumNo(int albumsNo);

    // 전체 앨버의 모든 파일 조회
    List<FileDTO> getAllThumbnails(int userNo);

    // 모달로 파일 조회
    FileDTO getFileByFileNo(int fileNo);

    // 파일 수정
    void updateFile(FileDTO fileDTO);

    // 파일 삭제
    void deleteFile(int fileNo);
}
