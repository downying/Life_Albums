import React, { createContext, useEffect, useState, useCallback } from 'react';
import Cookies from 'js-cookie'; // 쿠키 라이브러리 import
import api from '../apis/axios';
import * as auth from '../apis/user/auth';

export const LoginContext = createContext();

const LoginProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState(null);
    const [savedUsername, setSavedUsername] = useState(Cookies.get('rememberedId') || ''); // 쿠키에서 저장된 아이디 불러오기

    const loginCheck = useCallback(async () => {
        const accessToken = Cookies.get("accessToken");
        if (!accessToken) {
            logoutSetting();
            return;
        }
    
        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        try {
            const response = await auth.info();  // 사용자 정보 요청
            const data = response.data;
    
            // 사용자 정보 확인을 위한 로그
            console.log("사용자 정보:", data);
    
            if (data === 'UNAUTHORIZED' || response.status === 401) {
                logoutSetting();
                return;
            }
            loginSetting(data);
        } catch (error) {
            logoutSetting();
        }
    }, []);
    

    const login = async (id, pw, rememberId, navigate) => {
        try {
            const response = await api.post('/users/login', { id, pw });
            const data = response.data;
    
            // 응답 데이터에 userNo가 있는지 확인
            console.log("로그인 응답 데이터:", data);
    
            if (data && data.userNo) {
                console.log("로그인 성공:", data);
                Cookies.set("accessToken", data.accessToken);
    
                if (rememberId) {
                    Cookies.set("rememberedId", id, { expires: 7, path: '/' });
                    setSavedUsername(id);
                } else {
                    Cookies.remove("rememberedId");
                    setSavedUsername('');
                }
    
                loginSetting(data);
                navigate(`/albums/users/${data.userNo}`);
            } else {
                console.error("로그인 응답에 userNo가 없습니다.");
                setError('로그인 실패: ID 또는 비밀번호가 올바르지 않습니다.');
            }
        } catch (error) {
            console.error("로그인 요청 중 오류:", error);
            setError('서버와의 통신 중 오류가 발생했습니다.');
        }
    };
    
    
    const logout = (navigate) => {
        if (window.confirm("정말로 로그아웃하시겠습니까?")) {
            console.log("로그아웃 요청");
            logoutSetting();
            navigate("/");
        }
    };

    const logoutSetting = () => {
        api.defaults.headers.common.Authorization = undefined;
        Cookies.remove("accessToken");
        console.log("액세스 토큰 삭제됨");
        setIsLoggedIn(false);
        setUserInfo(null);

        // 로그아웃할 때 쿠키에 저장된 rememberedId는 삭제하지 않음으로써 아이디 유지
    };

    const loginSetting = (userData) => {
        console.log("로그인 상태 설정 중, 받은 userData:", userData);  // 디버깅 로그 추가
        setIsLoggedIn(true);
        setUserInfo(userData);  // userInfo에 사용자 데이터 설정
        setError(null);  // 로그인 성공 시 에러 초기화
    };
    

    useEffect(() => {
        loginCheck();
    }, [loginCheck]);

    return (
        <LoginContext.Provider value={{ isLoggedIn, login, logout, userInfo, error, savedUsername }}>
            {children}
        </LoginContext.Provider>
    );
};

export default LoginProvider;
