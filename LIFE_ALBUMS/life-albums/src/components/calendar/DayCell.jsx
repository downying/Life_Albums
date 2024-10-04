import React from 'react';

const DayCell = ({ day, thumbnails = [], onClick }) => {
  const handleThumbnailClick = () => {
    if (thumbnails.length > 0) {
      console.log('썸네일 데이터:', thumbnails); // 썸네일 내용 확인
      onClick(day, thumbnails); // day와 thumbnails를 전달
    } else {
      console.log('썸네일이 없습니다.'); // 썸네일 배열이 비어 있는 경우 로그
    }
  };
  

  return (
    <div className="calendar-day flex flex-col items-stretch justify-between p-1 hover:bg-gray-100 cursor-pointer h-full w-full max-w-[150px] max-h-[150px] overflow-hidden">
      <div className="text-xs sm:text-sm font-semibold">{day}</div>
      <div className="flex-grow flex items-center justify-center overflow-hidden aspect-square">
        {thumbnails.length > 0 ? (
          <img
            src={thumbnails[0].filePath ? thumbnails[0].filePath : '/default-thumbnail.jpg'}
            alt={`썸네일 ${day}`}
            className="w-full h-full object-cover border border-gray-300 cursor-pointer"
            onClick={() => handleThumbnailClick(thumbnails[0])} // 클릭 시 첫 번째 썸네일 전달
          />
        ) : (
          <div className="w-full h-full bg-gray-200 border border-gray-300"></div>
        )}
      </div>
    </div>
  );
};

export default DayCell;
