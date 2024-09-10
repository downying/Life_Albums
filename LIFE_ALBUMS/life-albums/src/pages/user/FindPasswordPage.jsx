import React from 'react';
import FindPasswordForm from '../../containers/user/FindPasswordFrom';



// 비밀번호 찾기 페이지


const FindPasswordPage = () => {
  return (
    <div>
      {/* Password 찾기 폼 컴포넌트 */}
      <main className="flex flex-col items-center justify-center min-h-[88vh] bg-gray-100">
        <FindPasswordForm /> {/* FindPasswordForm 컴포넌트 호출 */}


      </main>
    </div>
  );
};


export default FindPasswordPage;
