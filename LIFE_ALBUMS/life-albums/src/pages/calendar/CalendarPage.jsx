import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DayCell from '../../components/calendar/DayCell';
import Sidebar from '../../components/albums/Sidebar';
import { getThumbnailsByUserAndDate, allThumbnails, thumbnails } from '../../apis/files/files'; // API 함수 임포트

const CalendarPage = () => {
  const location = useLocation(); // 사용자 정보를 포함한 위치 객체
  const { userInfo } = location.state || {};
  const [currentDate, setCurrentDate] = useState(new Date());
  const [thumbnailsData, setThumbnailsData] = useState({}); // 날짜별 사진 상태를 객체로 관리
  const navigate = useNavigate(); // useNavigate 훅 선언
  const [currentAlbum, setCurrentAlbum] = useState([]); // 현재 앨범의 썸네일 리스트
  const [currentAlbumNo, setCurrentAlbumNo] = useState(null); // 선택된 앨범 번호
  const monthNames = [
    "1월", "2월", "3월", "4월", "5월", "6월",
    "7월", "8월", "9월", "10월", "11월", "12월"
  ];

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  useEffect(() => {
    if (userInfo) {
      const fetchThumbnailsForMonth = async () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        let newThumbnails = {};

        for (let day = 1; day <= daysInMonth(year, month); day++) {
          try {
            const response = await getThumbnailsByUserAndDate(userInfo.userNo, year, month, day);
            newThumbnails[day] = response.thumbnails; // 날짜에 맞는 썸네일 저장
          } catch (error) {
            console.error(`사진을 불러오는 중 오류 발생 (날짜: ${year}-${month}-${day}):`, error);
          }
        }

        setThumbnailsData(newThumbnails); // 모든 날짜에 대한 썸네일 업데이트
      };

      fetchThumbnailsForMonth(); // 썸네일 불러오기 실행
    }
  }, [userInfo, currentDate]);

  // 앨범 선택 시 썸네일을 불러오는 함수
  const fetchThumbnailsFromAPI = async (albumNo) => {
    try {
      const data = await thumbnails(albumNo, userInfo.accessToken);
      console.log('썸네일 API 응답 데이터:', data);
      
      // 현재 상태와 비교하여 변경이 있을 때만 업데이트
      if (JSON.stringify(currentAlbum) !== JSON.stringify(data.thumbnails || [])) {
        setCurrentAlbum(data.thumbnails || []);
      }
    } catch (err) {
      console.error('썸네일 불러오기 오류:', err);
    }
  };

  const handleDayClick = (day, thumbnails) => {
    if (thumbnails.length > 0) {
      const albumNo = thumbnails[0].albumsNo; // 첫 번째 사진의 앨범 번호 가져오기
      navigate(`/albums/${albumNo}`); // 해당 앨범 페이지로 이동
    } else {
      console.log('선택한 날짜에 사진이 없습니다.');
    }
  };

  const handleSelectAlbum = (albumNo) => {
    console.log('선택한 앨범 번호:', albumNo);
    if (albumNo) {
      setCurrentAlbumNo(albumNo);
      fetchThumbnailsFromAPI(albumNo); // API 호출
      navigate(`/albums/${albumNo}`);
    } else {
      navigate('/calendar');
    }
  };

  const fetchAllThumbnails = async () => {
    if (!userInfo || !userInfo.accessToken) {
      console.log('사용자 정보가 없습니다.');
      return;
    }

    try {
      const data = await allThumbnails(userInfo.userNo, userInfo.accessToken);
      setCurrentAlbum(data.photos || []);
    } catch (err) {
      console.error('모든 앨범 썸네일 불러오기 오류:', err);
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
      const dayThumbnails = thumbnailsData[day] || []; // 해당 날짜의 썸네일

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

  useEffect(() => {
    if (currentAlbumNo) {
      fetchThumbnailsFromAPI(currentAlbumNo);
    }
  }, [currentAlbumNo]);

  useEffect(() => {
    console.log('사용자 정보:', userInfo);
    if (userInfo) {
      // 썸네일 불러오기 로직
    } else {
      console.error('사용자 정보가 없습니다.');
    }
  }, [userInfo, currentDate]);

  return (
    <div className="flex flex-col bg-gray-100">
      <div className="h-[calc(100vh-116px)] flex">
        <Sidebar
          onSelectAlbum={handleSelectAlbum}
          fetchAllThumbnails={fetchAllThumbnails}
          currentAlbum={currentAlbum}
          currentAlbumNo={currentAlbumNo}
          setCurrentAlbumNo={setCurrentAlbumNo}
          userInfo={userInfo}
        />
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
