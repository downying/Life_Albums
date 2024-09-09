import React from 'react';

const Checkbox = ({ label, className, checked, onChange }) => {
  return (
    <label className={`inline-flex items-center ${className}`}>
      <input 
        type="checkbox" 
        className="form-checkbox h-3 w-3 text-gray-600"
        checked={checked}  // 부모 컴포넌트에서 받은 checked 값 적용
        onChange={onChange}  // 부모 컴포넌트에서 받은 onChange 이벤트 처리
      />
      <span className="ml-2 whitespace-nowrap">{label}</span>
    </label>
  );
};

export default Checkbox;
