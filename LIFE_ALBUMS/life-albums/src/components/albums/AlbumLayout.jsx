import React from 'react';
import AddPhotoButton from './AddPhotoButton';

const AlbumLayout = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="relative w-96 h-64 border border-black rounded-lg shadow-lg">
        {/* 왼쪽 페이지 */}
        <div className="absolute left-0 top-0 w-1/2 h-full border-r border-black flex justify-center items-center">
          <div className="w-full h-full p-5 flex justify-center items-center">
            <AddPhotoButton />
          </div>
        </div>
        {/* 오른쪽 페이지 */}
        <div className="absolute right-0 top-0 w-1/2 h-full flex justify-center items-center">
          <div className="w-full h-full p-5 flex justify-center items-center bg-white">
            {/* 이곳에는 추가될 사진이나 콘텐츠가 들어갑니다 */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlbumLayout;
