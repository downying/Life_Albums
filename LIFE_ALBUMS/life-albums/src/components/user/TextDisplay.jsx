import React from 'react';

// 아이디 텍스트를 표시하는 컴포넌트
const TextDisplay = ({ id }) => {
  return (
    <div className="text-center w-full max-w-3xl mx-auto"> {/* max-w-lg로 너비 확장 */}
      <h2 className="text-center font-bold text-2xl mb-5 whitespace-nowrap mx-auto">회원님의 아이디는 다음과 같습니다.</h2> {/* 줄바꿈 방지 */}
      <p className="text-2xl mb-10">{id}</p>
    </div>
  );
};

export default TextDisplay;
