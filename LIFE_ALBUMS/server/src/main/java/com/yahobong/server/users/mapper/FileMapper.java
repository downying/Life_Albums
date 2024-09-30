package com.yahobong.server.users.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import com.yahobong.server.users.dto.FileDTO;

@Mapper
public interface FileMapper {

    // 파일 등록
    void insertFile(FileDTO fileDTO);

    // 앨범의 썸네일 조회
    List<FileDTO> getThumbnailsByAlbumNo(@Param("albumsNo") int albumsNo, @Param("offset") int offset,
            @Param("limit") int limit);

    // 날짜에 따른 썸네일 조회 
    List<FileDTO> getDateThumbnailsByDate(@Param("year") int year, @Param("month") int month, @Param("day") int day);


    // 즐겨찾기 썸네일 조회
    List<FileDTO> getStarThumbnailsByAlbumNo(@Param("albumsNo") int albumsNo, @Param("offset") int offset,
            @Param("limit") int limit);

    // 특정 앨범의 총 썸네일 수 조회
    int getTotalThumbnailCountByAlbumNo(int albumsNo);

    // 전체 앨범의 모든 파일 조회 (offset, limit 추가)
    List<FileDTO> getAllPhotosByUser(@Param("userNo") int userNo, @Param("offset") int offset, @Param("limit") int limit);
    int getTotalThumbnailCountByUser(int userNo);

    // 모달로 파일 조회
    FileDTO getFileByFileNo(int fileNo);

    // 파일 수정
    void updateFile(FileDTO fileDTO);

    // 파일 삭제
    void deleteFile(int fileNo);

    // 즐겨찾기 상태 토글
    void toggleStarByFileNo(int fileNo);
}
