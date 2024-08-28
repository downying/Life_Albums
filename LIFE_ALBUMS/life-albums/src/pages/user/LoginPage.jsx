import React from 'react';
import LoginForm from '../../containers/user/LoginForm';
import Header from '../../components/static/Header';
import Footer from '../../components/static/Footer';

const LoginPage = () => {
    return (
      <div className="flex flex-col min-h-screen">
        <Header /> {/* 헤더 추가 */}
        <div className="flex-grow flex items-center justify-center bg-gray-100">
          <div className="relative w-[600px] h-[500px]"> {/* 세로 길이를 500px로 늘림 */}
            {/* 앨범 모양 */}
            <div className="absolute w-full h-full bg-white border-4 border-black rounded-3xl shadow-lg">
              {/* 왼쪽 페이지 효과 - 책의 등 부분 */}
              <div className="absolute top-0 left-0 w-[60px] h-full bg-gray-100 rounded-l-3xl border-r-8 border-black"></div>
              <div className="absolute top-0 left-[60px] w-[20px] h-full bg-gray-100 border-r-4 border-black"></div>
              
              {/* 하단 페이지 효과 */}
              <div className="absolute bottom-0 left-0 w-full h-12 bg-gray-100 border-t-4 border-black rounded-b-3xl"></div>
              <div className="absolute bottom-4 left-0 w-4/5 h-2 bg-black"></div>
              <div className="absolute bottom-6 left-0 w-3/4 h-2 bg-black"></div>
            </div>

            {/* 로그인 폼 */}
            <div className="absolute top-[50px] left-44"> {/* 폼 위치를 더 위로 조정 */}
              <div className="w-72 bg-white p-6 border-2 border-gray-300 rounded-lg shadow-lg">
                <LoginForm />
              </div>
            </div>
          </div>
        </div>
        <Footer /> {/* 푸터 추가 */}
      </div>
    );
  };
  
  export default LoginPage;