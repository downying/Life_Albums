import api from "../axios";

// 파일 업로드 (사진 등록)
export const fileInsert = async (formData, token, username) => {
  try {
    // formData에 username을 추가
    formData.append('username', username);

    const response = await api.post('/fileApi/upload', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('사진 등록 중 오류 발생:', error);
    throw error;
  }
};

// 앨범의 썸네일 조회
export const thumbnails = async (albumsNo, token, page = 1, size = 2) => {
  try {
    const response = await api.get(`/fileApi/thumbnails/${albumsNo}`, {
      headers: { 
        Authorization: `Bearer ${token}`,
      },
      params: { 
        page, 
        size 
      }
    });
    console.log("Response from thumbnails API:", response.data);  
    return response.data;
  } catch (error) {
    console.error("Error fetching thumbnails:", error);
    throw error;
  }
};

// 파일 조회 (모달)
export const getFile = async (fileNo, token) => {
  try {
    const response = await api.get(`/fileApi/${fileNo}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("파일 가져오는 중 오류 발생:", error);
    throw error;
  }
};

// 파일 수정
export const updateFile = async (fileNo, fileData, token) => {
  try {
    if (!fileData) {
      throw new Error("fileData가 정의되어 있지 않습니다.");
    }

    const updatedFileData = {
      year: fileData.year || new Date().getFullYear(),
      month: fileData.month || new Date().getMonth() + 1,
      day: fileData.day || new Date().getDate(),
      content: fileData.memo || '',
    };

    console.log('수정할 데이터:', updatedFileData); 

    const response = await api.put(`/fileApi/${fileNo}`, updatedFileData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('파일 수정 중 오류:', error.response?.data || error.message);
    throw error;
  }
};

// 파일 삭제
export const deleteFile = async (fileNo, token) => {
  try {
    const response = await api.delete(`/fileApi/${fileNo}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('파일 삭제 중 오류:', error);
    throw error;
  }
};

// 모든 앨범의 썸네일 조회
export const allThumbnails = async (userNo, token, page = 1, size = 2) => {
  try {
    console.log(`Fetching all thumbnails for userNo: ${userNo}, token: ${token}`);

    const response = await api.get(`/fileApi/photos/${userNo}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page,
        size,
      },
    });

    console.log("Response data:", response.data);  
    return response.data;  
  } catch (error) {
    console.error('전체 앨범 썸네일 조회 중 오류 발생:', error);
    throw error;
  }
};

// 즐겨찾기 상태 토글 (스타 토글)
export const toggleStar = async (fileNo, token) => {
  try {
    const response = await api.put(`/fileApi/toggleStar/${fileNo}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Response from toggleStar API:", response.data);  
    return response.data;
  } catch (error) {
    console.error('즐겨찾기 상태 변경 중 오류 발생:', error);
    throw error;
  }
};

// 날짜에 맞는 사진 가져오기
// export const getDateThumbnails = async (year, month, day, token) => {
//   try {
//     const response = await api.get(`/fileApi/dateThumbnails`, {
//       headers: {
//         Authorization: `Bearer ${token}`, // 인증 헤더 추가
//       },
//       params: {
//         year,
//         month,
//         day,
//       },
//     });
//     console.log("getDateThumbnails API의 응답:", response.data);
//     return response.data; // 반환된 데이터
//   } catch (error) {
//     console.error("날짜 사진 가져오기 중 오류:", error);
//     throw error; // 에러 발생
//   }
// };

export const getThumbnailsByUserAndDate = async (userNo, year, month, day) => {
  try {
    const response = await api.get(`/fileApi/calendar/${userNo}`, {
      params: {
        year,
        month,
        day,
      },
    });
    return response.data;
  } catch (error) {
    console.error("특정 사용자와 날짜의 사진 가져오기 중 오류:", error);
    throw error;
  }
};