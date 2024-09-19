import React, { useContext, useEffect } from 'react';
import { BrowserRouter, Route, Routes, useNavigate, useLocation } from 'react-router-dom'; 
import './App.css';
import LoginPage from './pages/user/LoginPage';
import FindIdPage from './pages/user/FindIdPage';
import FindIdResultPage from './pages/user/FindIdResultPage';
import FindPasswordPage from './pages/user/FindPasswordPage';
import ResetPasswordPage from './pages/user/ResetPasswordPage';
import JoinPage from './pages/user/JoinPage';
import AlbumsPage from './pages/albums/AlbumsPage';
import CalendarPage from './pages/calendar/CalendarPage';
import LoginProvider, { LoginContext } from './components/LoginProvider';
import Header from './components/static/Header';
import Footer from './components/static/Footer';

function App() {
  return (
    <LoginProvider>
      <BrowserRouter>
        <Header />
        <AppRoutes />
        <Footer />
      </BrowserRouter>
    </LoginProvider>
  );
}

const AppRoutes = () => {
    const { isLoggedIn, userInfo, isCheckingLogin } = useContext(LoginContext);
    const navigate = useNavigate();
    const currentLocation = useLocation();

    useEffect(() => {
        // 로그인 상태를 확인 중일 때는 리다이렉트하지 않음
        if (isCheckingLogin) {
            return;
        }

        // 회원가입, 로그인, 아이디 찾기 페이지는 예외로 처리
        const publicRoutes = ['/join', '/login', '/findId', '/calendar', '/findIdResult', '/findPassword', '/resetPassword'];
    
        if (!publicRoutes.includes(currentLocation.pathname)) {
            if (isLoggedIn && userInfo) {
              const userPath = `/albums/users/${userInfo.userNo}`;
              if (currentLocation.pathname !== userPath) {
                  navigate(userPath);
              }
            } else {
                navigate('/login');
            }
        }
    }, [isLoggedIn, isCheckingLogin, navigate, currentLocation.pathname, userInfo]);

  


  return (
    <Routes>
      {/* 로그인 페이지 */}
      <Route path="/login" element={<LoginPage />} />

      {/* 아이디찾기 페이지 */}
      <Route path="/findId" element={<FindIdPage />} />

      {/* 아이디찾기 완료 페이지*/}
      <Route path="/findIdResult" element={<FindIdResultPage />} />

      {/* 비밀번호 찾기 페이지 */}
      <Route path="/findPassword" element={<FindPasswordPage />} />

      {/* 비밀번호 재설정 페이지 */}
      <Route path="/resetPassword" element={<ResetPasswordPage />} />
      
      {/* 회원가입 */}
      <Route path="/join" element={<JoinPage />} />
      
      {/* 앨범 */}
      <Route path="/albums/users/:userNo" element={<AlbumsPage />} />

      {/* 캘린더 */}
      <Route path="/calendar" element={<CalendarPage />} />

      {/* 기본 경로 처리 */}
      <Route path="/" element={<LoginPage />} />
    </Routes>
  );
};

export default App;
