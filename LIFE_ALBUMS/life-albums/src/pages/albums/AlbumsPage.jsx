import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import NavigationButton from '../../components/albums/NavigationButton';
import AddPhotoButton from '../../components/albums/AddPhotoButton';
import Header from '../../components/static/Header';
import Footer from '../../components/static/Footer';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Link } from 'react-router-dom';

const AlbumsPage = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleCalendarClick = () => {
    setShowDatePicker(!showDatePicker);
  };

  return (
    <div className="flex flex-col min-h-screen relative">
      <Header /> {/* 헤더 추가 */}
      <div className="flex-grow flex items-center justify-center bg-gray-100 p-4">
        <div className="relative flex items-center">
          {/* 네비게이션 버튼과 앨범을 하나로 묶기 */}
          <div className="relative flex items-center">
            {/* 왼쪽 네비게이션 버튼 */}
            <NavigationButton
              direction="left"
              onClick={() => console.log('Left Clicked')}
              className="absolute left-[-60px] top-[50%] transform -translate-y-1/2 text-7xl text-black z-10 bg-white p-4 rounded-full shadow-lg border-none outline-none focus:outline-none focus:ring-0 active:outline-none active:ring-0"
            />

            <div className="relative w-[800px] h-[500px]">
              {/* 앨범의 옆면 표현 */}
              <div className="absolute left-[-10px] top-0 w-[30px] h-full bg-gray-300 rounded-l-[10px] z-0"></div>
              {/* 앨범의 밑면 표현 */}
              <div className="absolute bottom-[-10px] left-0 w-full h-[30px] bg-gray-300 rounded-b-[10px] z-0"></div>

              {/* 책 모양 */}
              <div className="relative w-full h-full bg-white border-4 border-black rounded-[20px] shadow-2xl flex overflow-hidden z-10">
                {/* 왼쪽 페이지 */}
                <div className="relative w-1/2 h-full bg-white flex flex-col justify-center items-center border-r-4 border-black p-6 shadow-inner">
                  <div className="relative">
                    <img src="/img/example.jpg" alt="Example" className="w-[250px] h-[350px] object-cover rounded-lg shadow-md" />
                    <div className="flex items-center mt-4">
                      <FontAwesomeIcon icon={faHeart} className="text-red-500 mr-2" />
                      <span className="text-sm">2024-08-24</span>
                    </div>
                  </div>
                </div>

                {/* 중앙 접힘 부분 */}
                <div className="relative w-[30px] h-full bg-gray-300 flex justify-center items-center shadow-inner">
                  <div className="w-[2px] h-[90%] bg-black"></div>
                </div>

                {/* 오른쪽 페이지 */}
                <div className="relative w-1/2 h-full bg-white flex justify-center items-center p-6 shadow-inner">
                  <AddPhotoButton />
                </div>
              </div>
            </div>

            {/* 오른쪽 네비게이션 버튼 */}
            <NavigationButton
              direction="right"
              onClick={() => console.log('Right Clicked')}
              className="absolute right-[-60px] top-[50%] transform -translate-y-1/2 text-7xl text-black z-10 bg-white p-4 rounded-full shadow-lg border-none outline-none focus:outline-none focus:ring-0 active:outline-none active:ring-0"
            />
          </div>

          {/* 아이콘과 링크 배치 - 앨범 옆 상단에 위치 */}
          <div className="absolute right-[-160px] top-0 flex flex-col items-start space-y-4">
            <button onClick={handleCalendarClick} className="flex items-center space-x-2 relative">
              <FontAwesomeIcon icon={faCalendarAlt} className="text-black text-xl" />
              <span className="text-black">+ 사진 추가하기</span>
            </button>
            <Link to="/favorites" className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faHeart} className="text-red-500 text-xl" />
              <span className="text-black">즐겨찾기 모아보기</span>
            </Link>

            {/* DatePicker 표시 */}
            {showDatePicker && (
              <div className="relative">
                <div className="absolute mt-2">
                  <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} inline />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer /> {/* 푸터 추가 */}
    </div>
  );
};

export default AlbumsPage;
