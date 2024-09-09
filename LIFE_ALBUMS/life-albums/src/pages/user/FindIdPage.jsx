import React from 'react';
import FindIdForm from '../../containers/user/FindIdForm'; 

const FindIdPage = () => {
  return (
    <div>
      {/* ID 찾기 폼 컴포넌트 */}
      <main className="flex flex-col items-center justify-center min-h-[88vh] bg-gray-100">
        <FindIdForm /> {/* FindIdForm 컴포넌트 호출 */}
      </main>
    </div>
  );
};

export default FindIdPage;
