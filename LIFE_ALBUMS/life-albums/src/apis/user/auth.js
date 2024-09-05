import api from '../axios';

// 로그인
export const login = (id, pw) => api.post(`/login?id=${id}&pw=${pw}`);

// 회원정보 조회
export const info = () => api.get(`/users/info`);

// 회원 가입
export const join = (data) => api.post(`/users/join`, data);

// 아이디 중복 확인
export const checkId = async (id) => {
    try {
        const response = await api.get(`/users/checkId`, { params: { userId: id } });
        return response.data.exists;  // 서버에서 반환한 'exists' 값 사용
    } catch (error) {
        console.error('ID 중복 확인 오류:', error);
        throw error;
    }
};

// 이메일 중복 확인
export const checkMail = (mail) => {
    return api.get(`/users/checkMail?mail=${mail}`);
};
