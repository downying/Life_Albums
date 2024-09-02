import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/user/LoginPage';
import JoinPage from './pages/user/JoinPage';
import AlbumsPage from './pages/albums/AlbumsPage';
import CalenderPage from './pages/calender/CalenderPage';
import LoginProvider from './components/LoginProvider';
import Header from './components/static/Header';

function App() {
  return (
    <LoginProvider>
      <BrowserRouter> 
        <Routes>
          {/* 메인 페이지 */}
          <Route path="/" element={<LoginPage />} />
          
          {/* 회원가입 */}
          <Route path="/join" element={<JoinPage />} />
          
          {/* 앨범 */}
          <Route path="/album" element={<AlbumsPage />} />

          {/* 캘린더 */}
          <Route path="/calendar" element={<CalenderPage />} />
        </Routes>
      </BrowserRouter>
    </LoginProvider>
  );
}

export default App;
