import React, { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import NavigationButton from '../../components/albums/NavigationButton';
import AddPhotoButton from '../../components/albums/AddPhotoButton';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Link } from 'react-router-dom';
import Pagination from '../../components/albums/Pagenation';
import Sidebar from '../../components/albums/Sidebar';
import Modal from '../../components/albums/Modal';
import { fileInsert } from '../../apis/files/files';
import { getAllAlbums } from '../../apis/albums/album';
import { LoginContext } from '../../components/LoginProvider';

const AlbumsPage = () => {
  const { userInfo } = useContext(LoginContext);
  const [startDate, setStartDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAlbumNo, setCurrentAlbumNo] = useState(null); // 선택된 앨범 번호 상태
  const [currentAlbum, setCurrentAlbum] = useState([]); // 현재 앨범의 썸네일 리스트
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [check, setCheck] = useState(false); // check 상태 추가
  const albumsPerPage = 2; // 한 페이지에 두 개의 사진을 표시

  // Sidebar에서 선택된 앨범 번호를 받아와 상태를 업데이트하고 localStorage에 저장
  const handleSelectAlbum = (albumNo) => {
    console.log("AlbumsPage에서 전달받은 앨범 번호:", albumNo); // 로그 추가
    setCurrentAlbumNo(albumNo); // 앨범 번호 상태 업데이트
    localStorage.setItem("selectedAlbumNo", albumNo); // 앨범 번호를 localStorage에 저장
    fetchThumbnails(albumNo); // 선택된 앨범의 썸네일을 불러오기
  };

  // 앨범 선택 시 썸네일을 불러오는 함수
  const fetchThumbnails = async (albumNo) => { // 함수 위치를 수정
    setLoading(true);
    try {
      const url = `/fileApi/thumbnails/${albumNo}`; // albumNo에 맞는 썸네일 API 호출
      const response = await fetch(url);
      const data = await response.json();
      console.log("썸네일 API 응답 데이터:", data);
      setCurrentAlbum(data.thumbnails || []); // 응답 데이터를 currentAlbum에 저장
    } catch (err) {
      setError(err.message);
      console.error("썸네일 불러오기 오류:", err);
    } finally {
      setLoading(false);
    }
  };

  // currentAlbumNo가 업데이트되면 API 호출
  useEffect(() => {
    if (!currentAlbumNo) return;

    fetchThumbnails(currentAlbumNo); // 앨범 번호가 업데이트되면 썸네일을 가져옴
  }, [currentAlbumNo]); // currentAlbumNo가 변경될 때마다 호출

  // 페이지가 처음 로드될 때 localStorage에서 저장된 앨범 번호 가져오기
  useEffect(() => {
    const storedAlbumNo = localStorage.getItem("selectedAlbumNo");
    if (storedAlbumNo) {
      setCurrentAlbumNo(storedAlbumNo); // 저장된 앨범 번호로 상태 설정
      fetchThumbnails(storedAlbumNo);   // 해당 앨범의 썸네일 불러오기
    }
  }, []);

  // 전체 앨범 선택 시 모든 앨범의 썸네일을 불러오는 로직
  useEffect(() => {
    if (currentAlbumNo === 'ALL') {
      getAllAlbums(userInfo.userNo)
        .then(response => {
          setCurrentAlbum(response.data);
        })
        .catch(error => console.error('전체 앨범 불러오기 중 오류:', error));
    }
  }, [currentAlbumNo]);

  // 캘린더 아이콘 클릭 시 날짜 선택기 표시
  const handleCalendarIconClick = (e) => {
    e.stopPropagation();
    setShowDatePicker((prevShowDatePicker) => !prevShowDatePicker);
  };

  // 총 페이지 수 계산 (추가된 사진 수를 고려)
  const totalPages = Math.ceil(currentAlbum.length / albumsPerPage);

  const onPageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // 모달을 열고 닫는 로직
  const handleImageClick = () => {
    setIsModalOpen(true);
    setCheck(false); // 이미지 클릭 시 check 값 변경
  };

  const handleNoImageClick = () => {
    setIsModalOpen(true);
    setCheck(true); // 이미지가 없을 때 check 값 변경
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // 사진을 등록하는 함수
  const handleRegisterAlbum = async (newAlbum) => {
    if (!currentAlbumNo) {
      alert("앨범을 선택해 주세요.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', newAlbum.file);
      formData.append('data', JSON.stringify({
        albumsNo: currentAlbumNo,
        content: newAlbum.memo,
        year: new Date(newAlbum.date).getFullYear(),
        month: new Date(newAlbum.date).getMonth() + 1,
        day: new Date(newAlbum.date).getDate(),
        star: false,
      }));

      const result = await fileInsert(formData, userInfo.token, userInfo.id);
      console.log('사진 등록 성공:', result);

      // 사진 등록 후 썸네일 다시 불러오기 전에 로딩 상태로 변경
      setLoading(true);
      await fetchThumbnails(currentAlbumNo); // 썸네일 다시 불러오기
      setLoading(false);
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
  const addPhotoButtonPosition = currentPhotos.length < 2
    ? (currentPhotos.length === 0 ? 'left' : 'right')
    : 'none';

  return (
    <div className="flex flex-col min-h-[calc(100vh-116px)] relative">
      <div className="flex flex-grow">
        {/* 사이드바에 선택된 앨범 전달 */}
        <Sidebar onSelectAlbum={handleSelectAlbum} />

        <div className="flex-grow flex flex-col items-center justify-center bg-gray-100 p-4">
          <div className="relative flex items-center justify-center w-[80%] h-[95%]">
            <NavigationButton
              direction="left"
              onClick={() => console.log('Left Clicked')}
              className="absolute left-[-40px] md:left-[-60px] top-[50%] transform -translate-y-1/2 text-5xl md:text-7xl text-black z-10 bg-white p-2 md:p-4 rounded-full shadow-lg"
            />
            {/* 반응형 추가 */}
            <div className="relative w-full w-[80%] h-[85%]">
              {/* 앨범의 옆면 표현 */}
              <div className="absolute left-[-5px] md:left-[-10px] top-0 w-[15px] md:w-[30px] h-full bg-gray-300 rounded-l-[5px] md:rounded-l-[10px] z-0"></div>
              {/* 앨범의 밑면 표현 */}
              <div className="absolute bottom-[-5px] md:bottom-[-10px] left-0 w-full h-[15px] md:h-[30px] bg-gray-300 rounded-b-[5px] md:rounded-b-[10px] z-0"></div>

              <div className="relative w-full h-full bg-white border-2 md:border-4 border-black rounded-[10px] md:rounded-[20px] shadow-lg md:shadow-2xl flex overflow-hidden z-10">
                {currentPhotos.length > 0 ? (
                  currentPhotos.map((photo, index) => (
                    <div key={index} className="relative w-full sm:w-1/2 h-full bg-white flex flex-col justify-center items-center p-4 md:p-6">
                      <img
                        src={photo.filePath}
                        alt={`Photo ${index + 1}`}
                        className="w-[200px] md:w-[300px] h-[300px] md:h-[400px] object-cover rounded-lg shadow-md cursor-pointer"
                        onClick={() => handleImageClick(photo)}
                      />
                      <div className="flex items-center mt-4">
                        <FontAwesomeIcon icon={faHeart} className="text-red-500 mr-2" />
                        <span className="text-xs md:text-sm">
                          {`${photo.year}-${String(photo.month).padStart(2, '0')}-${String(photo.day).padStart(2, '0')}`}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="relative w-full sm:w-1/2 h-full bg-white flex justify-center items-center p-4 md:p-6">
                    <p>사진이 없습니다.</p>
                  </div>
                )}
                {addPhotoButtonPosition !== 'none' && (
                  <div className={`relative w-full sm:w-1/2 h-full bg-white flex justify-center items-center p-4 md:p-6 ${addPhotoButtonPosition === 'left' ? 'order-1' : 'order-2'}`}>
                    <AddPhotoButton onClick={handleNoImageClick} />
                  </div>
                )}
              
            </div>
          </div>

            <NavigationButton
              direction="right"
              onClick={() => console.log('Right Clicked')}
              className="absolute right-[-60px] top-[50%] transform -translate-y-1/2 text-7xl text-black z-10 bg-white p-4 rounded-full shadow-lg"
            />
          </div>

          <div className="absolute right-12 top-8 flex flex-col items-start space-y-4 z-10">
            <button className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faCalendarAlt} className="text-black text-xl" onClick={handleCalendarIconClick} />
              <span className="text-black">+ 사진 추가하기</span>
            </button>
            <Link to="/favorites" className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faHeart} className="text-red-500 text-xl" />
              <span className="text-black">즐겨찾기 모아보기</span>
            </Link>

            {showDatePicker && (
              <div className="relative">
                <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} inline />
              </div>
            )}
          </div>

          <div className="mt-2">
            <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={onPageChange} />
          </div>
        </div>
      </div>

      {isModalOpen && (
        <Modal
          album={currentAlbum}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onRegister={handleRegisterAlbum}
          check={check}  // check 상태 전달
        />
      )}
    </div>
  );
};

export default AlbumsPage;
