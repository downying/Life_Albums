import React from 'react';

// 아이디 텍스트를 표시하는 컴포넌트
const TextDisplay = ({ id }) => {
  return (
    <div className="text-center">
      <h2 className="text-xl mb-2">회원님의 아이디는 다음과 같습니다:</h2>
      <p className="text-lg font-bold">{id}</p>
    </div>
  );
};

export default TextDisplay;