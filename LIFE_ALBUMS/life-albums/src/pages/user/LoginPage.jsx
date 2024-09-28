import React from 'react';
import LoginForm from '../../containers/user/LoginForm';

const LoginPage = () => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-116px)]">
      <div className="flex-grow flex items-center justify-center bg-gray-100">
        <div className="relative w-full mx-auto max-w-[95%] sm:max-w-[80%] md:max-w-[60%] lg:max-w-[50%] xl:max-w-[40%] 2xl:max-w-[30%] h-[500px]"> {/* 반응형으로 max-w 사용 */}
          {/* 앨범 모양 */}
          <div className="absolute w-full h-full bg-white border-8 border-black rounded-3xl shadow-lg">
            {/* 왼쪽 페이지 효과 - 책의 등 부분 */}
            <div className="absolute top-0 left-0 w-[80px] h-full bg-gray-100 rounded-l-3xl border-r-8 border-black"></div>
            <div className="absolute top-0 left-[80px] w-[20px] h-full bg-gray-100 border-r-8 border-black"></div>

            {/* 하단 페이지 효과 */}
            <div className="absolute bottom-0 left-0 w-full h-12 bg-gray-100 border-t-8 border-black rounded-b-3xl"></div>
            <div className="absolute bottom-2 right-0 w-[90%] h-2 bg-black rounded-l"></div> {/* 반응형으로 90% 너비 설정 */}
            <div className="absolute bottom-6 right-0 w-[90%] h-2 bg-black rounded-l"></div> {/* 반응형으로 90% 너비 설정 */}
          </div>
          {/* 로그인 폼 */}
          <div className="absolute top-[50px] left-1/2 transform -translate-x-1/2"> {/* 중앙 정렬을 위해 반응형으로 조정 */}
            <div className="w-72 bg-white p-6 border-2 border-gray-300 rounded-lg shadow-lg">
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
