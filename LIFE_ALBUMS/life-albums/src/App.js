import React, { useContext, useEffect } from 'react';
import { BrowserRouter, Route, Routes, useNavigate, useLocation } from 'react-router-dom'; 
import './App.css';
import LoginPage from './pages/user/LoginPage';
import FindIdPage from './pages/user/FindIdPage';
import FindIdResultPage from './pages/user/FindIdResultPage';
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
        <Footer /> {/* Footer 컴포넌트를 BrowserRouter 내부로 이동 */}
      </BrowserRouter>
    </LoginProvider>
  );
}

const AppRoutes = () => {
  const { isLoggedIn } = useContext(LoginContext);
  const navigate = useNavigate();
  const currentLocation = useLocation(); // location을 다른 변수 이름으로 변경

  useEffect(() => {
    // 회원가입, 로그인, 아이디 찾기 페이지는 예외로 처리
    const publicRoutes = ['/join', '/login', '/findId', '/calendar', '/findIdResult'];
  
    // 현재 경로가 publicRoutes에 포함되지 않은 경우에만 리디렉션 수행
    if (!publicRoutes.includes(currentLocation.pathname)) {
      if (isLoggedIn) {
        navigate('/album');
      } else {
        navigate('/login');
      }
    }
  }, [isLoggedIn, navigate, currentLocation.pathname]);


  return (
    <Routes>
      {/* 로그인 페이지 */}
      <Route path="/login" element={<LoginPage />} />

      {/* 아이디찾기 페이지 */}
      <Route path="/findId" element={<FindIdPage />} />

      {/* 아이디찾기 완료 페이지*/}
      <Route path="/findIdResult" element={<FindIdResultPage />} />
      
      {/* 회원가입 */}
      <Route path="/join" element={<JoinPage />} />
      
      {/* 앨범 */}
      <Route path="/album" element={<AlbumsPage />} />

      {/* 캘린더 */}
      <Route path="/calendar" element={<CalendarPage />} />

      {/* 기본 경로 처리 */}
      <Route path="/" element={<LoginPage />} />
    </Routes>
  );
};

export default App;
