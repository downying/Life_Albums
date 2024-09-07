package com.yahobong.server.users.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.yahobong.server.users.dto.FileDTO;

@Mapper
public interface FileMapper {
    
    void insertFile(FileDTO fileDTO);
}
