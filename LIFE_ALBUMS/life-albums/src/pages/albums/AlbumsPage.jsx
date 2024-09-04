import React, { useState } from 'react';
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

const AlbumsPage = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);  // 모달 상태
  const [currentAlbum, setCurrentAlbum] = useState(null);  // 선택된 앨범 상태
  const albumsPerPage = 1; // 왼쪽에 하나의 사진만 표시

  // 임시 데이터로 1개의 앨범이 있다고 가정
  const albums = new Array(1).fill({
    date: '2024-08-24',
    imgSrc: '/img/example.jpg',
    memo: '메모 내용'
  });

  const totalPages = Math.ceil(albums.length / albumsPerPage);

  const handleCalendarClick = () => {
    setShowDatePicker(!showDatePicker);
  };

  const indexOfLastAlbum = currentPage * albumsPerPage;
  const indexOfFirstAlbum = indexOfLastAlbum - albumsPerPage;
  const currentAlbumData = albums.slice(indexOfFirstAlbum, indexOfLastAlbum)[0];

  const onPageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleImageClick = () => {
    setCurrentAlbum(currentAlbumData);  // 선택된 앨범 데이터를 설정
    setIsModalOpen(true);  // 모달 열기
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);  // 모달 닫기
  };

  const handleDeleteAlbum = () => {
    console.log('앨범 삭제');
    setIsModalOpen(false);
  };

  const handleUpdateAlbum = (updatedAlbum) => {
    console.log('앨범 수정:', updatedAlbum);
    setCurrentAlbum(updatedAlbum);
  };

  return (
    <div className="flex flex-col h-[90vh] relative"> {/* 페이지 높이를 90vh로 설정 */}
      <div className="flex flex-grow">
        <Sidebar /> {/* 사이드바 추가 */}
        
        <div className="flex-grow flex flex-col items-center justify-center bg-gray-100 p-4">
          <div className="relative flex items-center">
            <div className="relative flex items-center">
              <NavigationButton
                direction="left"
                onClick={() => console.log('Left Clicked')}
                className="absolute left-[-60px] top-[50%] transform -translate-y-1/2 text-7xl text-black z-10 bg-white p-4 rounded-full shadow-lg border-none outline-none focus:outline-none focus:ring-0 active:outline-none active:ring-0"
              />

              <div className="relative w-[900px] h-[600px]"> {/* 앨범 크기를 키움 */}
                <div className="absolute left-[-10px] top-0 w-[30px] h-full bg-gray-300 rounded-l-[10px] z-0"></div>
                <div className="absolute bottom-[-10px] left-0 w-full h-[30px] bg-gray-300 rounded-b-[10px] z-0"></div>

                <div className="relative w-full h-full bg-white border-4 border-black rounded-[20px] shadow-2xl flex overflow-hidden z-10">
                  <div className="relative w-1/2 h-full bg-white flex flex-col justify-center items-center border-r-4 border-black p-6 shadow-inner">
                    <div className="relative">
                      <img
                        src={currentAlbumData.imgSrc}
                        alt="Example"
                        className="w-[300px] h-[400px] object-cover rounded-lg shadow-md cursor-pointer"  // 앨범 크기 키움
                        onClick={handleImageClick}  // 사진 클릭 시 모달 열기
                      />
                      <div className="flex items-center mt-4">
                        <FontAwesomeIcon icon={faHeart} className="text-red-500 mr-2" />
                        <span className="text-sm">{currentAlbumData.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="relative w-[30px] h-full bg-gray-300 flex justify-center items-center shadow-inner">
                    <div className="w-[2px] h-[90%] bg-black"></div>
                  </div>

                  <div className="relative w-1/2 h-full bg-white flex justify-center items-center p-6 shadow-inner">
                    <AddPhotoButton />
                  </div>
                </div>
              </div>

              <NavigationButton
                direction="right"
                onClick={() => console.log('Right Clicked')}
                className="absolute right-[-60px] top-[50%] transform -translate-y-1/2 text-7xl text-black z-10 bg-white p-4 rounded-full shadow-lg border-none outline-none focus:outline-none focus:ring-0 active:outline-none active:ring-0"
              />
            </div>

            <div className="absolute right-[-160px] top-0 flex flex-col items-start space-y-4">
              <button onClick={handleCalendarClick} className="flex items-center space-x-2 relative">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-black text-xl" />
                <span className="text-black">+ 사진 추가하기</span>
              </button>
              <Link to="/favorites" className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faHeart} className="text-red-500 text-xl" />
                <span className="text-black">즐겨찾기 모아보기</span>
              </Link>

              {showDatePicker && (
                <div className="relative">
                  <div className="absolute mt-2">
                    <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} inline />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8">
            <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={onPageChange} />
          </div>
        </div>
      </div>

      {/* 모달 창 */}
      {currentAlbum && (
        <Modal
          album={currentAlbum}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onDelete={handleDeleteAlbum}
          onUpdate={handleUpdateAlbum}
        />
      )}

    </div>
  );
};

export default AlbumsPage;
