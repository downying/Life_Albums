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
      if (isCheckingLogin) {
        return; // 로그인 상태 확인 중에는 리다이렉트하지 않음
      }
    
      const publicRoutes = ['/join', '/login', '/findId', '/calendar', '/findIdResult', '/findPassword', '/resetPassword'];
    
      // 현재 경로를 확인하기 위한 정규 표현식
      const albumRegex = /^\/albums\/\d+$/;
      const userAlbumRegex = /^\/albums\/users\/\d+$/;
    
      // 로그인되지 않았고, 비공개 페이지로 이동하려고 할 때 로그인 페이지로 리다이렉트
      if (!isLoggedIn && !publicRoutes.includes(currentLocation.pathname)) {
        navigate('/login');
      }
    
      if (isLoggedIn && userInfo) {
        const userAlbumsPath = `/albums/users/${userInfo.userNo}`;
        
        // 앨범 경로와 사용자 앨범 경로를 예외로 처리
        const isAlbumPage = albumRegex.test(currentLocation.pathname);
        const isUserAlbumPage = userAlbumRegex.test(currentLocation.pathname);
    
        // 캘린더나 앨범 관련 경로가 아니면 리다이렉트
        if (currentLocation.pathname !== '/calendar' && !isAlbumPage && !isUserAlbumPage) {
          console.log('리다이렉트 대상 경로:', currentLocation.pathname);
          navigate(userAlbumsPath);
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
        
        {/* 캘린더 */}
        <Route path="/calendar" element={<CalendarPage />} />
        
        {/* 사용자 앨범 */}
        <Route path="/albums/users/:userNo" element={<AlbumsPage />} />

        {/* 특정 앨범 */}
        <Route path="/albums/:albumNo" element={<AlbumsPage />} />

        {/* 기본 경로 처리 */}
        <Route path="/" element={<LoginPage />} />
      </Routes>
    );
};

export default App;
