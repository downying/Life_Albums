import api from '../axios';

// 특정 유저의 앨범 조회
export const getAlbumsByUserNo = (userNo, token) => api.get(`/albums/users/${userNo}`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// 앨범 생성
export const addAlbum = (data, token) => api.post(`/albums/create`, data, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// 앨범 제목 수정
export const updateAlbumTitle = (albumsNo, data, token) => api.put(`/albums/update/${albumsNo}`, data, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// 앨범 삭제
export const deleteAlbum = (albumsNo, token) => api.delete(`/albums/delete/${albumsNo}`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

