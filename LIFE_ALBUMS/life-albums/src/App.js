import React, { useContext, useEffect } from 'react';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/user/LoginPage';
import JoinPage from './pages/user/JoinPage';
import AlbumsPage from './pages/albums/AlbumsPage';
import CalenderPage from './pages/calender/CalenderPage';
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

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/album');
    } else {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  return (
    <Routes>
      {/* 로그인 페이지 */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* 회원가입 */}
      <Route path="/join" element={<JoinPage />} />
      
      {/* 앨범 */}
      <Route path="/album" element={<AlbumsPage />} />

      {/* 캘린더 */}
      <Route path="/calendar" element={<CalenderPage />} />

      {/* 기본 경로 처리 */}
      <Route path="/" element={<LoginPage />} />
    </Routes>
  );
};

export default App;
