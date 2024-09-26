import React, { useEffect, useState, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faSave } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { addAlbum, getAlbumsByUserNo, updateAlbumTitle, deleteAlbum } from '../../apis/albums/album';
import { LoginContext } from '../LoginProvider';

const Sidebar = ({ onSelectAlbum }) => {
  const { userInfo } = useContext(LoginContext);
  const [albums, setAlbums] = useState([]);
  const [editingAlbum, setEditingAlbum] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [selectedAlbumNo, setSelectedAlbumNo] = useState(null); 
  const [currentAlbumNo, setCurrentAlbumNo] = useState(null);
  const navigate = useNavigate();

  // 사용자 앨범 목록 불러오기
  useEffect(() => {
    if (userInfo && userInfo.userNo) {
      getAlbumsByUserNo(userInfo.userNo)
        .then(response => {
          setAlbums(response.data);

          // 앨범 목록이 비어있지 않으면 첫 번째 앨범을 선택
          if (response.data.length > 0) {
            const firstAlbum = response.data[0];
            setSelectedAlbumNo(firstAlbum.albumsNo);  // 선택된 앨범 번호 업데이트
            onSelectAlbum(firstAlbum.albumsNo);  // 첫 번째 앨범을 부모 컴포넌트로 전달
            localStorage.setItem("selectedAlbumNo", firstAlbum.albumsNo);  // 로컬스토리지에 저장
          }
        })
        .catch(error => console.error('앨범 목록 불러오기 중 오류:', error));
    }
  }, [userInfo]); 

  // 앨범 목록 업데이트
  useEffect(() => {
    console.log("앨범 목록 업데이트됨:", albums);
  }, [albums]); // albums 상태가 변경될 때마다 로그 출력
  
  // 사이드바에서 앨범을 선택
  const handleAlbumClick = (albumNo) => {
    console.log("사이드바에서 선택된 앨범 번호:", albumNo); // 앨범 번호 로그 추가
    setSelectedAlbumNo(albumNo); // 선택된 앨범 번호 업데이트
    onSelectAlbum(albumNo); // 앨범 번호를 부모 컴포넌트로 전달
    localStorage.setItem("selectedAlbumNo", albumNo); // 앨범 번호를 로컬스토리지에 저장
  };

  //사이드바에서 앨범을 선택
  // const handleSelectAlbum = (album) => {
  //   if (!album || !album.albumsNo) {
  //     console.error("유효하지 않은 앨범:", album);
  //     return;
  //   }
  
  //   console.log("선택된 앨범 번호:", album.albumsNo); // 로그로 앨범 번호 확인
  //   setSelectedAlbumNo(album.albumsNo);
  //   setCurrentAlbumNo(album.albumsNo); // 선택된 앨범 번호 업데이트
  //   localStorage.setItem("selectedAlbumNo", album.albumsNo); // localStorage에 저장
  // };  
  
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
    console.log("편집할 앨범 번호:", album.albumsNo);
    setEditingAlbum(album.albumsNo);
    setNewTitle(album.title);
  };

  // 앨범 제목 저장
  const handleSaveClick = async (albumsNo) => {
    const targetAlbumNo = albumsNo || editingAlbum; // null일 경우 editingAlbum 사용
    console.log("저장할 앨범 번호:", targetAlbumNo); // 로그로 확인
    
    if (!targetAlbumNo) {
      console.error("앨범 번호가 유효하지 않습니다.");
      return;
    }
  
    try {
      const updatedAlbum = await updateAlbumTitle(albumsNo, { title: newTitle });
      console.log("업데이트된 앨범:", updatedAlbum.data);
  
      setAlbums(albums.map(album => (album.albumsNo === albumsNo ? updatedAlbum.data : album)));
      setEditingAlbum(null); // 수정 모드 해제
    } catch (error) {
      console.error("앨범 제목 수정 중 오류:", error);
    }
  };  

  // 앨범 삭제
  const handleDeleteClick = async (albumsNo) => {
    const confirmDelete = window.confirm('정말로 삭제하시겠습니까?');
    if (confirmDelete) {
      try {
        await deleteAlbum(albumsNo);
        setAlbums(albums.filter(album => album.albumsNo !== albumsNo));
      } catch (error) {
        console.error('앨범 삭제 중 오류:', error);
      }
    }
  };

  // 캘린더로 보기 클릭 시
  const handleCalendarClick = () => {
    navigate('/calendar');
  };

  return (
    <div className="w-64 bg-white text-black p-4 flex flex-col justify-between">
      <div>
        <div className="mb-4 hover:bg-gray-100 hover:rounded-lg p-2">
          <button className="flex items-center space-x-2 w-full text-left rounded" onClick={handleAddAlbum}>
            <FontAwesomeIcon icon={faPlus} />
            <span>앨범 추가하기</span>
          </button>
        </div>

        <div className="mb-4 hover:bg-gray-100 hover:rounded-lg p-2">
          <button className="flex items-center space-x-2 w-full text-left rounded" onClick={() => onSelectAlbum('ALL')}>
            <span>전체 앨범</span>
          </button>
        </div>

        {albums.map((album) => (
          <div
            key={album.albumsNo}
            className={`mb-4 p-2 rounded cursor-pointer ${selectedAlbumNo === album.albumsNo ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            onClick={() => handleAlbumClick(album.albumsNo)}
          >
            <div className="flex items-center justify-between">
              {editingAlbum === album.albumsNo ? (
                <>
                  <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="w-full p-1" />
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

      <div className="p-4">
        <button className="p-2 w-full bg-black text-white text-center rounded" onClick={handleCalendarClick}>
          캘린더로 보기
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
