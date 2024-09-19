import api from "../axios";

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