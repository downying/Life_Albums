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
      
      // 여기서 response.data를 사용하여 받은 데이터를 처리할 수 있습니다.
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('에러 발생:', error);
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
    // 데이터가 정의되어 있는지 체크
    if (!fileData) {
      throw new Error("fileData가 정의되어 있지 않습니다.");
    }

    const updatedFileData = {
      year: fileData.year || new Date().getFullYear(),
      month: fileData.month || new Date().getMonth() + 1,
      day: fileData.day || new Date().getDate(),
      content: fileData.memo || '', // content 필드로 메모를 보냄
    };

    console.log('수정할 데이터:', updatedFileData); // 전송할 데이터 로그

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
