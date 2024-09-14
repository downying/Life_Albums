import api from '../axios';

// 앨범 생성
export const addAlbum = (data) => api.post(`/albums/create`, data);

// 특정 유저의 앨범 조회
export const getAlbumsByUserNo = (userNo) => api.get(`/albums/users/${userNo}`);