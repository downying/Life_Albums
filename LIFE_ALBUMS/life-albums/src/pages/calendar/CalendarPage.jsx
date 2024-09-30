import React, { useState, useEffect } from 'react';
import DayCell from '../../components/calendar/DayCell';
import Sidebar from '../../components/albums/Sidebar';
import { getDateThumbnails } from '../../apis/files/files'; // API 함수 임포트
import { useNavigate } from 'react-router-dom'; // useNavigate 사용

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [thumbnails, setThumbnails] = useState({}); // 날짜별 사진 상태를 객체로 관리
  const navigate = useNavigate(); // useNavigate 훅 선언
  const monthNames = [
    "1월", "2월", "3월", "4월", "5월", "6월",
    "7월", "8월", "9월", "10월", "11월", "12월"
  ];

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  useEffect(() => {
    // 캘린더에 표시되는 달의 모든 날짜에 대해 사진을 미리 불러옴
    const fetchThumbnailsForMonth = async () => {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      let newThumbnails = {};

      for (let day = 1; day <= daysInMonth(year, month); day++) {
        try {
          const response = await getDateThumbnails(year, month, day);
          newThumbnails[day] = response.thumbnails; // 날짜에 맞는 썸네일을 저장
        } catch (error) {
          console.error(`사진을 불러오는 중 오류 발생 (날짜: ${year}-${month}-${day}):`, error);
        }
      }

      setThumbnails(newThumbnails); // 모든 날짜에 대한 썸네일 업데이트
    };

    fetchThumbnailsForMonth();
  }, [currentDate]);

  // 날짜 선택 시 썸네일이 있으면 앨범으로 이동
  const handleDayClick = (day, thumbnails) => {
    if (thumbnails.length > 0) {
      const albumNo = thumbnails[0].albumsNo; // 첫 번째 사진의 앨범 번호를 가져옴
      navigate(`/album/${albumNo}`); // 해당 앨범 페이지로 이동
    } else {
      console.log('선택한 날짜에 사진이 없습니다.');
    }
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const totalDays = daysInMonth(year, month);
    const firstDay = firstDayOfMonth(year, month);
    let days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className=""></div>);
    }

    for (let day = 1; day <= totalDays; day++) {
      const isSunday = (firstDay + day - 1) % 7 === 0;
      const dayThumbnails = thumbnails[day] || []; // 해당 날짜의 썸네일

      days.push(
        <DayCell
          key={`day-${day}`}
          day={day}
          thumbnails={dayThumbnails} // 썸네일 전달
          onClick={handleDayClick} // onClick 핸들러 추가
          className={isSunday ? 'text-red-500 bg-red-100' : ''}
        />
      );
    }

    return days;
  };

  const prevMonth = () => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1));
  };

  return (
    <div className="flex flex-col bg-gray-100">
      <div className="h-[calc(100vh-116px)] flex">
        <Sidebar />
        <div className="flex-grow flex mt-4 mb-4 items-center justify-center">
          <main className="flex-grow flex items-center justify-center w-full h-full">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col w-[70%] h-[95%]">
              <div className="bg-gray-200 text-gray-800 py-2 px-4 flex items-center justify-between">
                <button onClick={prevMonth} className="text-gray-600 hover:text-gray-800">
                  <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h2 className="font-bold text-sm sm:text-lg md:text-xl">
                  {currentDate.getFullYear()}년 {monthNames[currentDate.getMonth()]}
                </h2>
                <button onClick={nextMonth} className="text-gray-600 hover:text-gray-800">
                  <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <div className="flex-grow flex flex-col p-1 sm:p-2">
                <div className="grid grid-cols-7 gap-1 text-center font-semibold text-gray-600 text-xs sm:text-sm mb-1">
                  {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
                    <div key={day} className={index === 0 ? 'text-red-500' : ''}>{day}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1 flex-grow">
                  {renderCalendar()}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
