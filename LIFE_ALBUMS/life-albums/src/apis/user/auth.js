import api from '../axios';

// 로그인
export const login = (id, pw) => api.post(`/login?id=${id}&pw=${pw}`)

