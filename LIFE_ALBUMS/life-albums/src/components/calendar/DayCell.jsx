import React from 'react';
import { useNavigate } from 'react-router-dom';

const DayCell = ({ day, thumbnails = [], onClick }) => {
  const handleThumbnailClick = () => {
    if (thumbnails.length > 0) {
      onClick(day, thumbnails); // day와 thumbnails를 전달
    }
  };

  return (
    <div
      onClick={handleThumbnailClick}
      className="calendar-day flex flex-col items-stretch justify-between p-1 hover:bg-gray-100 cursor-pointer h-full w-full max-w-[150px] max-h-[150px] overflow-hidden"
    >
      <div className="text-xs sm:text-sm font-semibold">{day}</div>
      <div className="flex-grow flex items-center justify-center overflow-hidden aspect-square">
        {thumbnails.length > 0 ? (
          <img
            src={thumbnails[0].filePath ? thumbnails[0].filePath : '/default-thumbnail.jpg'}
            alt={`썸네일 ${day}`}
            className="w-full h-full object-cover border border-gray-300" 
          />
        ) : (
          <div className="w-full h-full bg-gray-200 border border-gray-300"></div>
        )}
      </div>
    </div>
  );
};

export default DayCell;
