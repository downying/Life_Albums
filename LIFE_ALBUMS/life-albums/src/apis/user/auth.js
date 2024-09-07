import api from '../axios';

// 로그인
export const login = (id, pw) => api.post(`/login?id=${id}&pw=${pw}`);

// 아이디 찾기
export const findId = (name, mail, phone) => api.get(`users/findId?name=${name}&mail=${mail}&phone=${phone}`);

// 회원정보 조회
export const info = () => api.get(`/users/info`);

// 회원 가입
export const join = (data) => api.post(`/users/join`, data);

// 아이디 중복 확인
export const checkId = (id) => {
    return api.get(`/users/checkId?id=${id}`);
};

// 이메일 중복 확인
export const checkMail = (mail) => {
    return api.get(`/users/checkMail?mail=${mail}`);
};
