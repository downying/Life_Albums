import React from 'react';
import { useNavigate } from 'react-router-dom';

const DayCell = ({ day, thumbnails = [], onClick }) => {
  const navigate = useNavigate();

  const handleThumbnailClick = (albumNo) => {
    // 앨범 페이지로 이동
    navigate(`/albums/${albumNo}`);
  };

  return (
    <div
      onClick={() => {
        if (thumbnails.length > 0) {
          handleThumbnailClick(thumbnails[0].albumsNo); // 첫 번째 썸네일의 앨범 번호로 이동
        }
      }}
      className="calendar-day flex flex-col items-stretch justify-between p-1 hover:bg-gray-100 cursor-pointer h-full w-full"
    >
      <div className="text-xs sm:text-sm font-semibold">{day}</div>
      <div className="flex-grow flex items-center justify-center mt-1">
        {thumbnails.length > 0 ? (
          <img
            src={thumbnails[0].filePath} // 첫 번째 썸네일만 표시
            alt={`썸네일 ${day}`}
            className="w-full h-full object-contain border border-gray-300"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 border border-gray-300"></div>
        )}
      </div>
    </div>
  );
};

export default DayCell;
