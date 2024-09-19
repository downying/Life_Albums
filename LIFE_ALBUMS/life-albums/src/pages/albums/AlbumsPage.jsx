import React, { useEffect, useState } from 'react';
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
import { thumbnails, fileInsert } from '../../apis/files/files';

const AlbumsPage = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [albums, setAlbums] = useState([]);
  const [currentAlbum, setCurrentAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [check, setCheck] = useState(false);
  const albumsPerPage = 2; // 페이지당 표시할 앨범 수

  useEffect(() => {
    const fetchThumbnails = async () => {
      try {
        setLoading(true);
        const data = await thumbnails(6); // albumsNo를 6으로 가정
        setAlbums(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchThumbnails();
  }, []);

  const totalPages = Math.ceil(albums.length / albumsPerPage);

  const handleCalendarIconClick = (e) => {
    e.stopPropagation();
    setShowDatePicker((prevShowDatePicker) => !prevShowDatePicker);
  };

  const onPageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleImageClick = (album) => {
    setCurrentAlbum(album);
    setIsModalOpen(true);
    setCheck(false);
  };

  const handleNoImageClick = () => {
    setCurrentAlbum(null);
    setIsModalOpen(true);
    setCheck(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentAlbum(null);
  };

  const handleDeleteAlbum = () => {
    console.log('앨범 삭제');
    setIsModalOpen(false);
    // TODO: 실제 삭제 로직 구현
  };

  const handleUpdateAlbum = (updatedAlbum) => {
    console.log('앨범 수정:', updatedAlbum);
    // TODO: 실제 업데이트 로직 구현
    setAlbums(albums.map(album => 
      album.id === updatedAlbum.id ? updatedAlbum : album
    ));
    setIsModalOpen(false);
  };

  const handleRegisterAlbum = async (newAlbum) => {
    try {
      const formData = new FormData();
      formData.append('file', newAlbum.file);
      formData.append('data', JSON.stringify({
        albumsNo: 6, // 적절한 앨범 번호를 설정해야 합니다.
        content: newAlbum.memo,
        year: new Date(newAlbum.date).getFullYear(),
        month: new Date(newAlbum.date).getMonth() + 1,
        day: new Date(newAlbum.date).getDate(),
        star: false, // 필요에 따라 수정
      }));

      const token = 'your_auth_token_here'; // 실제 인증 토큰으로 교체해야 합니다.
      const result = await fileInsert(formData, token);
      console.log('앨범 등록 성공:', result);
      // 성공 후 앨범 목록을 다시 불러옵니다.
      const updatedAlbums = await thumbnails(6);
      setAlbums(updatedAlbums);
      handleCloseModal();
    } catch (error) {
      console.error('앨범 등록 실패:', error);
      // 에러 처리 (예: 에러 메시지 표시)
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col min-h-[calc(100vh-116px)] relative">
      <div className="flex flex-grow">
        <Sidebar />

        <div className="flex-grow flex flex-col items-center justify-center bg-gray-100 p-4">
          <div className="relative flex items-center">
            <div className="relative flex items-center">
              <NavigationButton
                direction="left"
                onClick={() => onPageChange(currentPage - 1)}
                className="absolute left-[-60px] top-[50%] transform -translate-y-1/2 text-7xl text-black z-10 bg-white p-4 rounded-full shadow-lg border-none outline-none focus:outline-none focus:ring-0 active:outline-none active:ring-0"
              />

              <div className="relative w-[900px] h-[600px]">
                <div className="absolute left-[-10px] top-0 w-[30px] h-full bg-gray-300 rounded-l-[10px] z-0"></div>
                <div className="absolute bottom-[-10px] left-0 w-full h-[30px] bg-gray-300 rounded-b-[10px] z-0"></div>

                <div className="relative w-full h-full bg-white border-4 border-black rounded-[20px] shadow-2xl flex overflow-hidden z-10">
                  {albums.length === 0 ? (
                    <div className="relative w-full h-full bg-white flex justify-center items-center p-6 shadow-inner">
                      <AddPhotoButton onClick={handleNoImageClick} />
                    </div>
                  ) : albums.length === 1 ? (
                    <>
                      <div className="relative w-1/2 h-full bg-white flex flex-col justify-center items-center border-r-4 border-black p-6 shadow-inner">
                        <div className="relative">
                          <img
                            src={albums[0].imgSrc}
                            alt="Album"
                            className="w-[300px] h-[400px] object-cover rounded-lg shadow-md cursor-pointer"
                            onClick={() => handleImageClick(albums[0])}
                          />
                          <div className="flex items-center mt-4">
                            <FontAwesomeIcon icon={faHeart} className="text-red-500 mr-2" />
                            <span className="text-sm">{albums[0].date}</span>
                          </div>
                        </div>
                      </div>
                      <div className="relative w-[30px] h-full bg-gray-300 flex justify-center items-center shadow-inner">
                        <div className="w-[2px] h-[90%] bg-black"></div>
                      </div>
                      <div className="relative w-1/2 h-full bg-white flex justify-center items-center p-6 shadow-inner">
                        <AddPhotoButton onClick={handleNoImageClick} />
                      </div>
                    </>
                  ) : (
                    albums.slice((currentPage - 1) * albumsPerPage, currentPage * albumsPerPage).map((item, index) => (
                      <React.Fragment key={item.id}>
                        <div className="relative w-1/2 h-full bg-white flex flex-col justify-center items-center border-r-4 border-black p-6 shadow-inner">
                          <div className="relative">
                            <img
                              src={item.imgSrc}
                              alt={`Album ${index + 1}`}
                              className="w-[300px] h-[400px] object-cover rounded-lg shadow-md cursor-pointer"
                              onClick={() => handleImageClick(item)}
                            />
                            <div className="flex items-center mt-4">
                              <FontAwesomeIcon icon={faHeart} className="text-red-500 mr-2" />
                              <span className="text-sm">{item.date}</span>
                            </div>
                          </div>
                        </div>
                        {index === 0 && (
                          <div className="relative w-[30px] h-full bg-gray-300 flex justify-center items-center shadow-inner">
                            <div className="w-[2px] h-[90%] bg-black"></div>
                          </div>
                        )}
                      </React.Fragment>
                    ))
                  )}
                </div>
              </div>

              <NavigationButton
                direction="right"
                onClick={() => onPageChange(currentPage + 1)}
                className="absolute right-[-60px] top-[50%] transform -translate-y-1/2 text-7xl text-black z-10 bg-white p-4 rounded-full shadow-lg border-none outline-none focus:outline-none focus:ring-0 active:outline-none active:ring-0"
              />
            </div>

            <div className="absolute right-[-160px] top-0 flex flex-col items-start space-y-4">
              <button className="flex items-center space-x-2 relative">
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  className="text-black text-xl"
                  onClick={handleCalendarIconClick}
                />
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
          onDelete={handleDeleteAlbum}
          onRegister={handleRegisterAlbum}
          onUpdate={handleUpdateAlbum}
          check={check}
        />
      )}
    </div>
  );
};

export default AlbumsPage;