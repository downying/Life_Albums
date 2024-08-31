import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/user/LoginPage';
import JoinPage from './pages/user/JoinPage';
import AlbumsPage from './pages/albums/AlbumsPage';
import CalendarPage from './pages/calender/CalenderPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* 메인 페이지 */}
          <Route path="/" element={<LoginPage />} />
          
          {/* 로그인 */}
          <Route path="/join" element={<JoinPage />} />
          
          {/* 앨범  */}
          <Route path="/album" element={<AlbumsPage/>} />

          <Route path="/calender" element={<CalendarPage/>} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
