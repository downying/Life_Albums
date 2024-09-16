package com.yahobong.server.users.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.yahobong.server.users.dto.FileDTO;

@Mapper
public interface FileMapper {
    
    // 파일 등록
    void insertFile(FileDTO fileDTO);

    // f.userNo = a.userNo f*
    List<FileDTO> getThumbnailsByAlbumNo(@Param("albumsNo") int albumsNo, @Param("offset") int offset, @Param("limit") int limit);

    // f.userNo = a.userNo COUNT(*)
    int getTotalThumbnailCountByAlbumNo(int albumsNo);
}
