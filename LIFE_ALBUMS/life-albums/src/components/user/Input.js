import React from 'react';

const Input = ({ type, placeholder }) => {
  return (
    <input 
      type={type} 
      placeholder={placeholder} 
      className="border p-2 w-full rounded-md"
    />
  );
};

export default Input;
