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
  const [loading, setLoading] = useState(false); // 로딩 상태
  const navigate = useNavigate(); // useNavigate 훅 선언
  const [currentAlbum, setCurrentAlbum] = useState([]); // 현재 앨범의 썸네일 리스트
  const [currentAlbumNo, setCurrentAlbumNo] = useState(null); // 선택된 앨범 번호
  const monthNames = [
    "1월", "2월", "3월", "4월", "5월", "6월",
    "7월", "8월", "9월", "10월", "11월", "12월"
  ];

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();


   // 특정 날짜의 썸네일 가져오기
   useEffect(() => {
    if (!userInfo) return;

    const fetchThumbnailsForMonth = async () => {
      setLoading(true); // 로딩 시작

      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const newThumbnails = {};

      for (let day = 1; day <= daysInMonth(year, month); day++) {
        try {
          const response = await getThumbnailsByUserAndDate(userInfo.userNo, year, month, day);
          if (response && Array.isArray(response) && response.length > 0) {
            newThumbnails[day] = response;
          } else {
            newThumbnails[day] = [];
          }
        } catch (error) {
          console.error(`${year}년 ${month}월 ${day}일의 썸네일 불러오기 중 오류 발생:`, error);
          newThumbnails[day] = [];
        }
      }

      setThumbnailsData(newThumbnails);
      setLoading(false); // 로딩 종료
    };

    fetchThumbnailsForMonth();
  }, [userInfo, currentDate]);
  
  
  // 캘린더 렌더링
  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const totalDays = daysInMonth(year, month);
    const firstDay = firstDayOfMonth(year, month);
    let days = [];
  
    // 빈 칸 채우기 (첫 번째 날이 시작되는 요일을 기준으로)
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className=""></div>);
    }
  
    // 날짜 채우기
    for (let day = 1; day <= totalDays; day++) {
      const dayThumbnails = thumbnailsData[day] || []; // 날짜별 썸네일 가져오기
      console.log(`${month}월 ${day}일의 썸네일 데이터:`, dayThumbnails);
  
      days.push(
        <DayCell
          key={`day-${day}`}
          day={day}
          thumbnails={dayThumbnails}  // 썸네일 전달
          onClick={handleDayClick}  // 클릭 이벤트 핸들러 전달
        />
      );
      
    }
  
    return days;
  };

  // 특정 앨범의 썸네일 불러오기
  const fetchThumbnailsFromAPI = async (albumNo) => {
    if (!userInfo || !userInfo.accessToken || loading) {
      console.error('API 호출 중입니다. 현재 상태:', loading);
      return; // 이미 로딩 중이면 종료
    }

    setLoading(true); // 로딩 시작
    try {
      const data = await thumbnails(albumNo, userInfo.accessToken);
      if (data && data.thumbnails) {
        setCurrentAlbum(data.thumbnails);
      } else {
        console.warn('앨범의 썸네일을 찾을 수 없습니다.');
      }
    } catch (err) {
      console.error('썸네일 불러오기 오류:', err);
      alert('썸네일을 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  // 앨범 선택 시 썸네일 가져오기
  const handleSelectAlbum = (albumNo) => {
    if (albumNo) {
      setCurrentAlbumNo(albumNo);
      fetchThumbnailsFromAPI(albumNo);
      navigate(`/albums/${albumNo}`);
    } else {
      navigate('/calendar');
    }
  };

  // 날짜 클릭 시 해당 앨범으로 이동
  const handleDayClick = (day, thumbnails) => {
    if (thumbnails.length > 0) {
      const albumNo = thumbnails[0].albumsNo;
      setCurrentAlbumNo(albumNo);
      navigate(`/albums/${albumNo}`);
    } else {
      console.log('선택한 날짜에 사진이 없습니다.');
    }
  };
  

  // 모든 썸네일 불러오기 (전체 앨범)
  const fetchAllThumbnails = async () => {
    if (!userInfo || !userInfo.accessToken) {
      console.log('사용자 정보가 없습니다.');
      return;
    }

    try {
      const data = await allThumbnails(userInfo.userNo, userInfo.accessToken);
      if (data && data.photos) {
        setCurrentAlbum(data.photos);
      } else {
        console.warn('앨범의 썸네일을 찾을 수 없습니다.');
      }
    } catch (err) {
      console.error('모든 앨범 썸네일 불러오기 오류:', err);
      alert('앨범 썸네일을 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  useEffect(() => {
    if (currentAlbumNo) {
      fetchThumbnailsFromAPI(currentAlbumNo); // 앨범 번호가 있을 때만 호출
    }
  }, [currentAlbumNo]);  

  // 이전 달로 이동
  const prevMonth = () => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1));
  };

  // 다음 달로 이동
  const nextMonth = () => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1));
  };

  return (
    <div className="flex flex-col bg-gray-100">
       {/* <Sidebar
          onSelectAlbum={handleSelectAlbum}
          fetchAllThumbnails={fetchAllThumbnails}
          currentAlbum={currentAlbum}
          currentAlbumNo={currentAlbumNo}
          setCurrentAlbumNo={setCurrentAlbumNo}
          userInfo={userInfo}
        /> */}
      <div className="h-[calc(100vh-116px)] flex overflow-y-auto"> {/* 스크롤 추가 */}
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
              <div className="flex-grow flex flex-col p-1 sm:p-2 overflow-y-auto"> {/* 스크롤 추가 */}
                <div className="grid grid-cols-7 gap-1 text-center font-semibold text-gray-600 text-xs sm:text-sm mb-1">
                  {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
                    <div key={day} className={index === 0 ? 'text-red-500' : ''}>{day}</div>
                  ))}
                </div>
                <div className="flex-grow flex items-center justify-center">
                  {loading ? (
                    <div className="flex justify-center items-center h-full w-full">
                      <img src="/img/logo2.png" alt="Loading..." />
                    </div>
                  ) : (
                    <div className="grid grid-cols-7 gap-1 flex-grow">
                      {renderCalendar()}
                    </div>
                  )}
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
