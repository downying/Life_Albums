import React from 'react';

const DayCell = ({ day, onClick }) => (
  <div 
    onClick={() => onClick(day)} 
    className="flex flex-col items-stretch justify-between p-1 hover:bg-gray-100 cursor-pointer h-full "
  >
    <div className="text-xs sm:text-sm font-semibold">{day}</div>
    <div className="flex-grow flex items-center justify-center mt-1">
      <img 
        className="w-full h-full object-cover border border-gray-300"
      />
    </div>
  </div>
);

export default DayCell;