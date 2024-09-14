// apis/axios.js

import axios from 'axios';
import Cookies from 'js-cookie';

// Axios 인스턴스 생성
const api = axios.create();

// Axios 요청 인터셉터 설정 (토큰 자동 추가)
api.interceptors.request.use(config => {
  const token = Cookies.get('accessToken');  // 쿠키에서 토큰 가져오기
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;  // Authorization 헤더에 JWT 토큰 추가
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default api;
