import React, { useEffect, useState, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faSave } from '@fortawesome/free-solid-svg-icons'; // 휴지통 아이콘 추가
import { useNavigate } from 'react-router-dom';
import { addAlbum, getAlbumsByUserNo, updateAlbumTitle, deleteAlbum } from '../../apis/albums/album'; // deleteAlbum 추가
import { LoginContext } from '../LoginProvider';

const Sidebar = () => {
  const { userInfo } = useContext(LoginContext);
  const [albums, setAlbums] = useState([]);
  const [editingAlbum, setEditingAlbum] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const navigate = useNavigate();

  // 사용자 앨범 목록 불러오기
  useEffect(() => {
    if (userInfo && userInfo.userNo) {
      getAlbumsByUserNo(userInfo.userNo)
        .then(response => {
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
        title: `새 앨범 ${albums.length + 1}`,
      };

      try {
        const response = await addAlbum(newAlbum);
        setAlbums([...albums, response.data]);
      } catch (error) {
        console.error('앨범 추가 중 오류:', error);
      }
    }
  };

  // 앨범 제목 수정 버튼 클릭 시
  const handleEditClick = (album) => {
    setEditingAlbum(album.albumsNo);
    setNewTitle(album.title);
  };

  // 앨범 제목 저장
  const handleSaveClick = async (albumsNo) => {
    try {
      const updatedAlbum = await updateAlbumTitle(albumsNo, { title: newTitle });
      setAlbums(albums.map(album => (album.albumsNo === albumsNo ? updatedAlbum.data : album)));
      setEditingAlbum(null);
    } catch (error) {
      console.error('앨범 제목 수정 중 오류:', error);
    }
  };

  // 앨범 삭제
  const handleDeleteClick = async (albumsNo) => {
    const confirmDelete = window.confirm('정말로 삭제하시겠습니까?');
    if (confirmDelete) {
      try {
        await deleteAlbum(albumsNo);
        setAlbums(albums.filter(album => album.albumsNo !== albumsNo)); // 삭제된 앨범 제거
      } catch (error) {
        console.error('앨범 삭제 중 오류:', error);
      }
    }
  };

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

        <div className="mb-4 hover:bg-gray-100 hover:rounded-lg p-2">
          <div className="flex items-center justify-between rounded">
            <span>전체 앨범</span>
            <FontAwesomeIcon icon={faEdit} />
          </div>
        </div>

        {/* 동적으로 불러온 앨범 목록 */}
        {albums.map((album) => (
          <div key={album.albumsNo} className="mb-4 hover:bg-gray-100 hover:rounded-lg p-2">
            <div className="flex items-center justify-between rounded">
              {editingAlbum === album.albumsNo ? (
                <>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full p-1"
                  />
                  <FontAwesomeIcon icon={faSave} onClick={() => handleSaveClick(album.albumsNo)} />
                </>
              ) : (
                <>
                  <span>{album.title}</span>
                  <div className="flex items-center space-x-2">
                    <FontAwesomeIcon icon={faEdit} onClick={() => handleEditClick(album)} />
                    <FontAwesomeIcon icon={faTrash} onClick={() => handleDeleteClick(album.albumsNo)} />
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 캘린더 보기 버튼 */}
      <div className="p-4">
        <button className="p-2 w-full bg-black text-white text-center rounded" onClick={handleCalendarClick}>
          캘린더로 보기
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
