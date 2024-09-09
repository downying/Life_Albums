import React from 'react';

const Button = ({ text, onClick }) => {
  return (
    <button className="bg-black text-white p-2 w-full rounded-md" onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
