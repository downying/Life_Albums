import api from "../axios";

export const fileInsert = async (File, token) => {
  try {
    const response = await api.post(`/fileApi/upload`, File, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('파일 업로드 에러:', error);
    throw error;
  }
};

export const thumbnails = async (albumsNo, token, page = 1, size = 2) => {
  try {
    const response = await api.get(`/fileApi/thumbnails/${albumsNo}`, {
      headers: { 
        Authorization: `Bearer ${token}`
      },
      params: { 
        page, 
        size 
      }
    });
    
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('썸네일 조회 에러:', error);
    throw error;
  }
};