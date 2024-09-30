import React, { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartFilled } from '@fortawesome/free-solid-svg-icons'; // 채워진 하트
import { faHeart as faHeartOutline } from '@fortawesome/free-regular-svg-icons'; // 빈 하트
import NavigationButton from '../../components/albums/NavigationButton';
import AddPhotoButton from '../../components/albums/AddPhotoButton';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Sidebar from '../../components/albums/Sidebar';
import Pagination from '../../components/albums/Pagenation';
import Modal from '../../components/albums/Modal';
import { fileInsert, updateFile, thumbnails, deleteFile, allThumbnails, toggleStar } from '../../apis/files/files';
import { LoginContext } from '../../components/LoginProvider';
import { useNavigate, useParams } from 'react-router-dom';

const AlbumsPage = () => {
  const { userInfo } = useContext(LoginContext); // 로그인 정보를 가져옴
  const [fileNo, setFileNo] = useState(null); // 선택된 파일 번호
  const [startDate, setStartDate] = useState(new Date()); // 날짜 선택 상태
  const [dataStartDate, setDataStartDate] = useState([]); // 선택된 날짜 배열
  const [showDatePicker, setShowDatePicker] = useState(false); // 날짜 선택기 표시 여부
  const [starClick, setStarClick] = useState(false); // 즐겨찾기 클릭 상태
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 상태
  const [currentAlbumNo, setCurrentAlbumNo] = useState(null); // 선택된 앨범 번호
  const [currentAlbum, setCurrentAlbum] = useState([]); // 현재 앨범의 썸네일 리스트
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const [check, setCheck] = useState(false); // 체크 상태 추가
  const albumsPerPage = 2; // 한 페이지에 표시할 사진 수
  const [rotationClasses, setRotationClasses] = useState({});
  const navigate = useNavigate();
  const { albumNo } = useParams();

  // 페이지가 처음 로드될 때 localStorage에서 저장된 앨범 번호 가져오기
  useEffect(() => {
    if (!userInfo || !userInfo.accessToken) {
      console.log('사용자 정보가 없습니다.');
      return;
    }
  
    const storedAlbumNo = localStorage.getItem('selectedAlbumNo');
  
    // URL의 albumNo를 우선시하고, 없으면 localStorage의 값을 사용
    if (albumNo) {
      setCurrentAlbumNo(albumNo);  // URL에서 가져온 albumNo 설정
      fetchThumbnails(albumNo);    // URL의 albumNo로 썸네일 가져오기
    } else if (storedAlbumNo) {
      setCurrentAlbumNo(storedAlbumNo);
      fetchThumbnails(storedAlbumNo);
    } else {
      fetchAllThumbnails(); // 저장된 앨범 번호가 없으면 전체 앨범 가져오기
    }
  }, [albumNo, userInfo]); // URL에서 albumNo가 변경되면 다시 실행

  useEffect(() => {
    if (albumNo && userInfo) {
      console.log('Fetching thumbnails for album:', albumNo);
      setCurrentAlbumNo(albumNo);  // 앨범 번호 상태 설정
      fetchThumbnails(albumNo);    // 해당 앨범의 썸네일 불러오기
    }
  }, [albumNo, userInfo]);  // albumNo 또는 userInfo가 변경될 때 실행

  useEffect(() => {
    if (userInfo && currentAlbumNo) {
      fetchThumbnails(currentAlbumNo);  // 현재 앨범 번호로 썸네일 불러오기
    }
  }, [currentAlbumNo, userInfo]);
  

  // 페이지가 처음 로드될 때 URL에 있는 albumNo로 설정
  useEffect(() => {
    if (albumNo) {
      setCurrentAlbumNo(albumNo);
      fetchThumbnails(albumNo); // URL에 있는 albumNo로 썸네일을 불러옴
    }
  }, [albumNo, userInfo]); // albumNo 또는 userInfo가 변경될 때 마다 실행

  // Sidebar에서 선택된 앨범 번호를 받아와 상태를 업데이트하고 localStorage에 저장
  const handleSelectAlbum = (albumNo) => {
    console.log('Sidebar에서 선택한 앨범 번호:', albumNo);
    setCurrentAlbumNo(albumNo);       // 선택된 앨범 번호 설정
    localStorage.setItem('selectedAlbumNo', albumNo);  // 로컬 스토리지에 저장
    navigate(`/albums/${albumNo}`);  // 해당 앨범 페이지로 이동
  };

  // 전체 앨범의 썸네일을 불러오는 함수
  const fetchAllThumbnails = async () => {
    console.log('fetchAllThumbnails 호출 중 - userInfo:', userInfo);

    if (!userInfo || !userInfo.accessToken) {
      console.log('fetchAllThumbnails 내부 - 사용자 정보가 없습니다.', userInfo);
      return;
    }

    try {
      console.log('전체 앨범 썸네일을 불러오는 중...');
      const data = await allThumbnails(userInfo.userNo, userInfo.accessToken);
      console.log('전체 앨범 썸네일 데이터:', data);
      setCurrentAlbum(data.photos || []);
      setCurrentPage(1);
    } catch (err) {
      console.error('모든 앨범 썸네일 불러오기 오류:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('앨범 상태 변경:', currentAlbum);
    console.log('로딩 상태 변경:', loading);
  }, [currentAlbum, loading]);

  // 앨범 선택 시 썸네일을 불러오는 함수
  const fetchThumbnails = async (albumNo) => {
    setLoading(true);  // 로딩 시작
    try {
      const data = await thumbnails(albumNo, userInfo.accessToken);
      console.log('썸네일 API 응답 데이터:', data);
      setCurrentAlbum(data.thumbnails || []);  // 응답 데이터를 currentAlbum에 설정
    } catch (err) {
      setError(err.message);  // 에러 메시지 설정
      console.error('썸네일 불러오기 오류:', err);
    } finally {
      setLoading(false);  // 로딩 끝
    }
  };

  // 캘린더 아이콘 클릭 시 썸네일을 불러오는 함수 (오타 수정: celendar -> calendar)
  const calendarFetchThumbnails = async (albumNo, dateArray) => {
    console.log(dateArray); // 선택된 날짜 배열 확인

    setLoading(true); // 로딩 시작
    try {
        const [year, month, day] = dateArray; // 배열 구조 분해
        const baseUrl = `/fileApi/dateThumbnails`; // albumNo는 필요 없음
        const params = new URLSearchParams({
            year: year,
            month: month,
            day: day,
        });
        const url = `${baseUrl}?${params}`;

        const response = await fetch(url);
        const data = await response.json();
        console.log('썸네일 API 응답 데이터:', data);
        setCurrentAlbum(data.thumbnails || []); // 응답 데이터를 currentAlbum에 저장
    } catch (err) {
        setError(err.message); // 에러 메시지 저장
        console.error('썸네일 불러오기 오류:', err);
    } finally {
        setLoading(false); // 로딩 끝
    }
};

  // 즐겨찾기 상태 토글 함수
  const handleToggleStar = async (fileNo, token) => {
    try {
      const response = await toggleStar(fileNo, token); // 즐겨찾기 토글 API 호출
      console.log('Response from toggleStar API:', response);

      // 상태 업데이트: 특정 fileNo의 star 상태를 업데이트
      setCurrentAlbum((prevAlbum) =>
        prevAlbum.map((photo) =>
          photo.fileNo === fileNo
            ? { ...photo, star: !photo.star } // 즐겨찾기 상태를 토글
            : photo
        )
      );

      console.log('즐겨찾기 상태 변경 완료:', response);
    } catch (error) {
      console.error('즐겨찾기 상태 변경 중 오류 발생:', error);
    }
  };

  // 즐겨찾기 클릭 시 썸네일을 불러오는 함수
  const starFetchThumbnails = async (albumNo) => {
    setLoading(true); // 로딩 시작
    try {
      const url = `/fileApi/starThumbnails/${albumNo}`; // albumNo에 맞는 썸네일 API 호출
      const response = await fetch(url);
      console.log(response);

      const data = await response.json();
      console.log('썸네일 API 응답 데이터:', data);
      setCurrentAlbum(data.thumbnails || []); // 응답 데이터를 currentAlbum에 저장
    } catch (err) {
      setError(err.message); // 에러 메시지 저장
      console.error('썸네일 불러오기 오류:', err);
    } finally {
      setLoading(false); // 로딩 끝
    }
  };

  // 캘린더 아이콘 클릭 시 날짜 선택기 표시
  const handleCalendarIconClick = (e) => {
    e.stopPropagation();
    setShowDatePicker((prevShowDatePicker) => !prevShowDatePicker); // 날짜 선택기 상태 토글
  };

  // 즐겨찾기 아이콘 클릭
  const handleStarIconClick = (e) => {
    e.stopPropagation();
    setStarClick((prevStarClick) => !prevStarClick); // 즐겨찾기 상태 토글
  };

  // 총 페이지 수 계산
  const totalPages = Math.ceil(currentAlbum.length / albumsPerPage);

  const onPageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber); // 페이지 변경
    }
  };

  // 이미지 클릭 시 파일 번호를 설정하고 모달을 염
  const handleImageClick = (photo) => {
    console.log('선택된 파일 번호:', photo.fileNo);
    setFileNo(photo.fileNo);

    // 선택한 사진이 속한 앨범 번호를 가져와서 해당 앨범으로 이동
    const albumNo = photo.albumsNo;
    setCurrentAlbumNo(albumNo); 
    localStorage.setItem('selectedAlbumNo', albumNo);

    // 페이지 이동을 추가
    navigate(`/albums/${albumNo}`); // 해당 앨범 페이지로 이동

    setIsModalOpen(true); // 모달을 열기
    setCheck(false); 
  };
  // 파일 삭제 함수
  const handleDeleteFile = async () => {
    try {
      await deleteFile(fileNo, userInfo.accessToken); // 파일 삭제 API 호출
      console.log('파일이 삭제되었습니다.');
      await fetchThumbnails(currentAlbumNo); // 썸네일 다시 불러오기
    } catch (error) {
      console.error('파일 삭제 중 오류:', error);
    }
  };

  // 파일 업데이트 함수
  const handleUpdateFile = async (updatedFile) => {
    try {
      await updateFile(fileNo, updatedFile, userInfo.accessToken); // 파일 업데이트 API 호출
      console.log('파일이 업데이트되었습니다.');

      setCurrentAlbum((prev) =>
        prev.map((photo) =>
          photo.fileNo === fileNo ? { ...photo, date: updatedFile.date } : photo
        )
      ); // 업데이트된 사진 상태 변경
    } catch (error) {
      console.error('파일 업데이트 중 오류:', error);
    }
  };

  // 사진을 등록하는 함수
  const handleRegisterAlbum = async (newAlbum) => {
    if (!currentAlbumNo) {
      alert('앨범을 선택해 주세요.'); // 앨범 미선택 시 경고
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', newAlbum.file);
      formData.append(
        'data',
        JSON.stringify({
          albumsNo: currentAlbumNo,
          content: newAlbum.memo,
          year: new Date(newAlbum.date).getFullYear(),
          month: new Date(newAlbum.date).getMonth() + 1,
          day: new Date(newAlbum.date).getDate(),
          star: false,
        })
      );

      const result = await fileInsert(formData, userInfo.accessToken); // 사진 등록 API 호출
      console.log('사진 등록 성공:', result);
      await fetchThumbnails(currentAlbumNo); // 변경된 사항 반영
    } catch (error) {
      console.error('사진 등록 실패:', error);
    }
  };

  // 현재 페이지의 사진을 계산
  const currentPhotos = currentAlbum.slice(
    (currentPage - 1) * albumsPerPage,
    currentPage * albumsPerPage
  );

  // 'Add Photo' 버튼 위치 결정
  const addPhotoButtonPosition =
    currentPhotos.length < 2
      ? currentPhotos.length === 0
        ? 'left'
        : 'right'
      : 'none';

  const handleNoImageClick = () => {
    setIsModalOpen(true);
    setCheck(true); // 이미지가 없을 때 check 값 변경
  };

  const handleThumbnailClick = (albumNo) => {
    // 앨범 페이지로 이동
    navigate(`/albums/${albumNo}`);
  };
  

  const handleCloseModal = () => {
    setIsModalOpen(false); // 모달 닫기
    if (currentAlbumNo) {
      fetchThumbnails(currentAlbumNo); // 앨범의 썸네일을 다시 불러오기
    } else {
      fetchAllThumbnails(); // 전체 앨범의 썸네일을 다시 불러오기
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-116px)] relative">
      <div className="flex flex-grow">
        {/* Sidebar에 전체 앨범 클릭 시 fetchAllThumbnails가 호출되도록 설정 */}
        <Sidebar
          onSelectAlbum={handleSelectAlbum} // handleSelectAlbum 함수를 전달
          currentAlbum={currentAlbum}
          currentAlbumNo={currentAlbumNo}
          setCurrentAlbumNo={setCurrentAlbumNo} // setCurrentAlbumNo 전달
        />

        <div className="flex-grow flex flex-col items-center justify-center bg-gray-100 p-4">
          <div className="relative flex items-center justify-center w-[80%] h-[95%]">
            {/* 왼쪽 화살표 버튼 */}
            <NavigationButton
              direction="left"
              onClick={() => console.log('Left Clicked')}
              className="absolute left-[-40px] md:left-[-60px] top-[50%] transform -translate-y-1/2 text-5xl md:text-7xl text-black z-10 bg-white p-2 md:p-4 rounded-full shadow-lg"
            />

            {/* 앨범 UI */}
            <div className="relative w-full h-full bg-white border-2 md:border-4 border-black rounded-[10px] md:rounded-[20px] shadow-lg md:shadow-2xl flex overflow-hidden z-10">
              {currentPhotos.length > 0 ? (
                currentPhotos.map((photo, index) => (
                  <div
                    key={index}
                    className="relative w-full sm:w-1/2 h-full bg-white flex flex-col justify-center items-center p-4 md:p-6"
                  >
                    <img
                      src={photo.filePath}
                      alt={`Photo ${index + 1}`}
                      className="w-[200px] md:w-[300px] h-[300px] md:h-[400px] object-contain rounded-lg shadow-md cursor-pointer"
                      onClick={() => handleImageClick(photo)}
                    />
                    <div className="flex items-center mt-4 space-x-2">
                      <FontAwesomeIcon
                        icon={photo.star ? faHeartFilled : faHeartOutline}
                        onClick={() => handleToggleStar(photo.fileNo, userInfo.token)}
                        className={`cursor-pointer ${
                          photo.star ? 'text-red-500' : 'text-gray-400'
                        }`}
                      />
                      <span className="text-xs md:text-sm">
                        {`${photo.year}-${String(photo.month).padStart(
                          2,
                          '0'
                        )}-${String(photo.day).padStart(2, '0')}`}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="relative w-full sm:w-1/2 h-full bg-white flex justify-center items-center p-4 md:p-6">
                  <p>사진이 없습니다.</p>
                </div>
              )}

              {/* Add Photo Button */}
              {addPhotoButtonPosition !== 'none' && (
                <div
                  className={`relative w-full sm:w-1/2 h-full bg-white flex justify-center items-center p-4 md:p-6 ${
                    addPhotoButtonPosition === 'left' ? 'order-1' : 'order-2'
                  }`}
                >
                  <AddPhotoButton onClick={handleNoImageClick} />
                </div>
              )}
            </div>

            {/* 오른쪽 화살표 버튼 */}
            <NavigationButton
              direction="right"
              onClick={() => console.log('Right Clicked')}
              className="absolute right-[-60px] top-[50%] transform -translate-y-1/2 text-7xl text-black z-10 bg-white p-4 rounded-full shadow-lg"
            />
          </div>

          {/* 상단 오른쪽 부분 */}
          <div className="absolute right-12 top-8 flex flex-col items-start space-y-4 z-10">
            <button className="flex items-center space-x-2">
              <FontAwesomeIcon
                icon={faCalendarAlt}
                className="text-black text-xl"
                onClick={handleCalendarIconClick}
              />
              <span className="text-black">+ 사진 추가하기</span>
            </button>
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={handleStarIconClick}
            >
              <FontAwesomeIcon icon={faHeart} className="text-red-500 text-xl" />
              <span className="text-black">즐겨찾기 모아보기</span>
            </div>

            {showDatePicker && (
              <div className="relative">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => {
                    setStartDate(date);
                    const dateArray = [
                      date.getFullYear(),
                      date.getMonth() + 1,
                      date.getDate(),
                    ];
                    setDataStartDate(dateArray);
                    calendarFetchThumbnails(currentAlbumNo, dateArray);
                  }}
                  inline
                />
              </div>
            )}
          </div>

          {/* 페이지네이션 */}
          <div className="mt-2">
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={onPageChange}
            />
          </div>
        </div>
      </div>

      {/* Modal 창 */}
      {isModalOpen && (
        <Modal
          fileNo={fileNo}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onDelete={handleDeleteFile}
          onUpdate={handleUpdateFile}
          token={userInfo.token}
          onRegister={handleRegisterAlbum}
          check={check}
        />
      )}
    </div>
  );
};

export default AlbumsPage;
