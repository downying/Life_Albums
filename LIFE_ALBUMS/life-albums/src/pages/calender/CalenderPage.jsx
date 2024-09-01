import React, { useState } from 'react';
import Header from '../../components/static/Header';
import Footer from '../../components/static/Footer';
import DayCell from '../../components/calender/DayCell';
import Sidebar from '../../components/albums/Sidebar';

const CalenderPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const monthNames = [
    "1월", "2월", "3월", "4월", "5월", "6월",
    "7월", "8월", "9월", "10월", "11월", "12월"
  ];
  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const handleDayClick = (day) => {
    console.log(`Clicked on day: ${day}`);
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
      days.push(
        <DayCell
          key={`day-${day}`}
          day={day}
          onClick={handleDayClick}
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
    <div className="flex flex-col h-screen bg-gray-100"> {/* Match background */}
      <Header />
      <div className="flex flex-grow">
        <Sidebar /> {/* 사이드바 추가 */}
        <div className="flex-grow flex mt-4 mb-4"> {/* Add margin between header and footer */}
          <main className="flex-grow flex items-center justify-center">
            <div className="w-full h-[calc(100vh-200px)] max-w-5xl bg-white shadow-lg rounded-lg overflow-hidden flex flex-col"> {/* Adjusted height and width */}
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
      <Footer />
    </div>
  );
};

export default CalenderPage;
