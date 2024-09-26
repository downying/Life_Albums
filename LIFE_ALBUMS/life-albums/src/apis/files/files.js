import api from "../axios";

// 파일 업로드 (사진 등록)
export const fileInsert = async (formData, token, username) => {
  try {
    const response = await api.post('/fileApi/upload', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      params: { username }
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
      const response = await api.put(`/fileApi/${fileNo}`, fileData, {
          headers: {
              Authorization: `Bearer ${token}`,
          },
      });
      return response.data;
  } catch (error) {
      console.error('파일 수정 중 오류:', error);
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
