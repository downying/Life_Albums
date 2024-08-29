import React from 'react';

const NavigationButton = ({ direction, onClick }) => {
  return (
    <button 
      onClick={onClick} 
      className="text-5xl p-4 bg-transparent border-none outline-none focus:outline-none focus:ring-0 active:outline-none active:ring-0 appearance-none"
    >
      {direction === 'left' ? '<' : '>'}
    </button>
  );
};

export default NavigationButton;
