import React, { createContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import api from '../apis/axios';
import * as auth from '../apis/user/auth'; // 필요시 사용하는 import

export const LoginContext = createContext();

const LoginProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState(null);
    const [savedUsername, setSavedUsername] = useState(localStorage.getItem('savedUsername') || '');

    const loginCheck = async () => {
        const accessToken = Cookies.get("accessToken");
        if (!accessToken) {
            logoutSetting();
            return;
        }

        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

        try {
            const response = await auth.info(); // 유저 정보를 얻는 API 호출 예시
            const data = response.data;

            if (data === 'UNAUTHORIZED' || response.status === 401) {
                logoutSetting();
                return;
            }
            loginSetting(data);
        } catch (error) {
            logoutSetting();
        }
    };

    const login = async (id, pw, rememberId, navigate) => {
        try {
            const response = await api.post('/users/login', { id, pw });
            const data = response.data;

            if (data) {
                Cookies.set("accessToken", data.accessToken); // 토큰 저장

                if (rememberId) {
                    localStorage.setItem("savedUsername", id);
                    setSavedUsername(id);
                } else {
                    localStorage.removeItem("savedUsername");
                    setSavedUsername('');
                }

                loginSetting(data);
                alert("로그인 성공");
                navigate("/album");
            } else {
                setError('로그인 실패: ID 또는 비밀번호가 올바르지 않습니다.');
            }
        } catch (error) {
            console.error(error);
            setError('서버와의 통신 중 오류가 발생했습니다.');
        }
    };

    const logout = (navigate) => {
        if (window.confirm("정말로 로그아웃하시겠습니까?")) {
            logoutSetting();
            navigate("/");
        }
    };

    const logoutSetting = () => {
        api.defaults.headers.common.Authorization = undefined;
        Cookies.remove("accessToken");
        setIsLoggedIn(false);
        setUserInfo(null);
    };

    const loginSetting = (userData) => {
        setIsLoggedIn(true);
        setUserInfo(userData); // 유저 정보를 상태로 저장
    };

    useEffect(() => {
        loginCheck();
    }, []);

    return (
        <LoginContext.Provider value={{ isLoggedIn, login, logout, userInfo, error, savedUsername }}>
            {children}
        </LoginContext.Provider>
    );
};

export default LoginProvider;
