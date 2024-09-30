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
    const [isCheckingLogin, setIsCheckingLogin] = useState(true); // 로그인 상태 확인 중인지 여부
    const [isLoading, setIsLoading] = useState(false);

    const loginCheck = useCallback(async () => {
        console.log("로그인 상태 확인 시작");
        const accessToken = Cookies.get("accessToken");
        if (!accessToken) {
            console.log("액세스 토큰 없음, 로그아웃 처리");
            logoutSetting(); // 로그아웃 처리
            setIsCheckingLogin(false); // 로그인 확인 완료
            return;
        }
    
        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        console.log("액세스 토큰 존재, 사용자 정보 요청 중...");

        try {
            const response = await auth.info();  // 사용자 정보 요청
            const data = response.data;
    
            if (data === 'UNAUTHORIZED' || response.status === 401) {
                console.log("인증 실패, 로그아웃 처리");
                logoutSetting(); // 로그아웃 처리
            } else {
                console.log("인증 성공, 사용자 데이터:", data);
                data.accessToken = accessToken;  // 쿠키에서 가져온 accessToken을 사용자 데이터에 추가
                loginSetting(data); // 로그인 상태 설정
            }
        } catch (error) {
            console.error("사용자 정보 요청 중 에러:", error);
            logoutSetting(); // 에러 발생 시 로그아웃 처리
        } finally {
            setIsCheckingLogin(false); // 로그인 확인 완료
        }
    }, []);

    const login = async (id, pw, rememberId, navigate) => {
        setIsLoading(true);
        setError(null);
    
        try {
            console.log("로그인 요청 전");
            const response = await api.post('/users/login', { id, pw });
            console.log("로그인 응답 후", response);
            console.log("응답 데이터:", response.data);  // 응답 데이터를 확인하기 위한 로그
    
            const data = response.data;
            
            if (data && data.accessToken && data.refreshToken) {
                Cookies.set("accessToken", data.accessToken);
                Cookies.set("refreshToken", data.refreshToken, { expires: 7, path: '/' });
                console.log("accessToken 쿠키에 저장됨:", Cookies.get("accessToken"));
                console.log("refreshToken 쿠키에 저장됨:", Cookies.get("refreshToken"));
    
                if (rememberId) {
                    Cookies.set("rememberedId", id, { expires: 7, path: '/' });
                    console.log("rememberedId 쿠키 저장됨:", Cookies.get("rememberedId"));
                } else {
                    Cookies.remove("rememberedId");
                    console.log("rememberedId 쿠키 삭제됨");
                }

                data.accessToken = data.accessToken; // accessToken을 userInfo에 저장
                loginSetting(data);
                alert("로그인 성공");
                navigate(`/albums/users/${data.userNo}`);
                return true;
            } else {
                console.error("로그인 실패: 서버 응답에 accessToken이 없습니다.");
                setError('로그인 실패: ID 또는 비밀번호가 올바르지 않습니다.');
                return false;
            }
        } catch (error) {
            console.error("로그인 요청 중 오류:", error);
            setError('서버와의 통신 중 오류가 발생했습니다.');
            return false;
        } finally {
            setIsLoading(false);
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
        Cookies.remove("refreshToken");
        console.log("액세스 토큰 삭제됨");
        setIsLoggedIn(false);
        setUserInfo(null);
    };

    const loginSetting = (userData) => {
        console.log("로그인 상태 설정 중");
        setIsLoggedIn(true);
        setUserInfo({
            ...userData,
            accessToken: userData.accessToken,  // accessToken을 명시적으로 설정
        });  // userInfo에 사용자 데이터 설정
        setError(null);  // 로그인 성공 시 에러 초기화
    };

    useEffect(() => {
        loginCheck();
    }, [loginCheck]);

    return (
        <LoginContext.Provider value={{ isLoggedIn, login, logout, userInfo, error, savedUsername, isCheckingLogin }}>
            {children}
        </LoginContext.Provider>
    );
};

export default LoginProvider;
