import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/user/LoginPage';
import JoinPage from './pages/user/JoinPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* 기본 경로는 LoginPage로 라우팅 */}
          <Route path="/" element={<LoginPage />} />
          {/* /join 경로로 JoinPage를 라우팅 */}
          <Route path="/join" element={<JoinPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
