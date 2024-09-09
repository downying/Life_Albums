import React from 'react';
import FindIdResulForm from '../../containers/FindIdResulForm';

const FindIdResultPage = () => {
  return (
    <div>
      <main className="flex flex-col items-center justify-center min-h-[88vh] bg-gray-100">
        <FindIdResulForm /> {/* FindIdResulForm 컴포넌트 호출 */}
      </main>
    </div>
  );
};

export default FindIdResultPage;
