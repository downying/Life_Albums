import React from 'react';
import JoinForm from '../../containers/user/JoinForm';

const JoinPage = () => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-116px)]">
      <div className="flex-grow bg-gray-100 flex flex-col justify-center p-4">
        {/* "JOIN" 텍스트의 위치와 크기를 조정 */}
        <h1 className="text-center text-4xl font-bold text-black-900 mb-2 mt-2">JOIN</h1> {/* mb-2로 수정 */}
        <JoinForm />
        <div className="text-center text-gray-500 text-xs mt-2 mb-2">
          <p>회원 가입 및 로그인 진행 시 본 사이트의</p>
          <p>
            <span className="text-blue-500">서비스 약관</span> 및 <span className="text-blue-500">개인 정보 보호 정책</span>
            에 동의하는 것으로 간주합니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default JoinPage;
