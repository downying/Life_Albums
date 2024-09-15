import React, { useEffect, useState, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { addAlbum, getAlbumsByUserNo } from '../../apis/albums/album';
import { LoginContext } from '../LoginProvider';

const Sidebar = () => {
  const { userInfo } = useContext(LoginContext);  // 로그인한 사용자 정보 가져오기
  const [albums, setAlbums] = useState([]);       // 서버에서 불러온 앨범 목록을 저장할 상태
  const navigate = useNavigate();

  // 사용자 앨범 목록 불러오기
  useEffect(() => {
    if (userInfo && userInfo.userNo) {
        console.log("요청할 userNo:", userInfo.userNo); // userNo가 올바르게 전달되는지 확인
        getAlbumsByUserNo(userInfo.userNo)
            .then(response => {
                console.log("서버 응답:", response); // 서버 응답 출력
                setAlbums(response.data);
            })
            .catch(error => console.error('앨범 목록 불러오기 중 오류:', error));
    }
}, [userInfo]);



  // 앨범 추가 버튼 클릭 시 새로운 앨범 생성
  const handleAddAlbum = async () => {
    if (userInfo && userInfo.userNo) {
      const newAlbum = {
        userNo: userInfo.userNo,
        title: `새 앨범 ${albums.length + 1}`,  // 앨범 이름을 '새 앨범'으로 자동 생성
      };

      try {
        const response = await addAlbum(newAlbum);  // 서버에 앨범 추가 요청
        setAlbums([...albums, response.data]);  // 새 앨범을 목록에 추가
      } catch (error) {
        console.error('앨범 추가 중 오류:', error);
      }
    } else {
      console.log('유효한 사용자 정보가 없습니다.');
    }
  };

  // 캘린더 보기 클릭 시 페이지 이동
  const handleCalendarClick = () => {
    navigate('/calendar');
  };

  return (
    <div className="w-64 bg-white text-black p-4 flex flex-col justify-between">
      <div>
        {/* 앨범 추가 버튼 */}
        <div className="mb-4 hover:bg-gray-100 hover:rounded-lg p-2">
          <button className="flex items-center space-x-2 w-full text-left rounded" onClick={handleAddAlbum}>
            <FontAwesomeIcon icon={faPlus} />
            <span>앨범 추가하기</span>
          </button>
        </div>

        {/* 동적으로 불러온 앨범 목록 */}
        {albums.map((album) => (
          <div key={album.albumsNo} className="mb-4 hover:bg-gray-100 hover:rounded-lg p-2">
            <div className="flex items-center justify-between rounded">
              <span>{album.title}</span>
              <FontAwesomeIcon icon={faEdit} />
            </div>
          </div>
        ))}
      </div>

      {/* 캘린더 보기 버튼 */}
      <div className="p-4">
        <button 
          className="p-2 w-full bg-black text-white text-center rounded" 
          onClick={handleCalendarClick}
        >
          캘린더로 보기
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
