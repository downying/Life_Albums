import React from 'react';

const Button = ({ text }) => {
  return (
    <button className="bg-black text-white p-2 w-full rounded-md">
      {text}
    </button>
  );
};

export default Button;
