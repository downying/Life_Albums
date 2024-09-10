import React from 'react';

const Input = ({ label, type, placeholder, checkLabel, onCheckClick, value, onChange }) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={label}>
          {label}
        </label>
      )}
      <div className="relative w-full">
        <input 
          type={type} 
          placeholder={placeholder} 
          className="border p-2 w-full rounded-md pr-24"
          value={value}  
          onChange={onChange}  
        />
        {checkLabel && (
          <button 
            type="button" // 버튼이 폼을 제출하지 않도록 type 설정
            className="absolute right-0 top-0 h-full border bg-white text-black px-4 rounded-r-md" 
            style={{ 
              borderColor: '#d1d5db', // input 필드의 기본 테두리 색상
              backgroundColor: 'white', // input 필드 안의 기본 배경색
            }}
            onClick={onCheckClick} // 클릭 시 실행될 함수 연결
          >
            {checkLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;
