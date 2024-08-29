import React from 'react';

const Input = ({ label, type, placeholder, checkLabel }) => {
  return (
    <div className="relative w-full">
      <input 
        type={type} 
        placeholder={placeholder} 
        className="border p-2 w-full rounded-md pr-24" // 오른쪽에 충분한 패딩을 줍니다.
      />
      {checkLabel && (
        <button 
          className="absolute right-0 top-0 h-full border bg-white text-black px-4 rounded-r-md" 
          style={{ 
            borderColor: '#d1d5db', // input 필드의 기본 테두리 색상
            backgroundColor: 'white', // input 필드 안의 기본 배경색
          }}
        >
          {checkLabel}
        </button>
      )}
    </div>
  );
};

export default Input;
