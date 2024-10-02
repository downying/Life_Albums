import React, { useEffect, useState, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faSave } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { addAlbum, getAlbumsByUserNo, updateAlbumTitle, deleteAlbum } from '../../apis/albums/album';
import { LoginContext } from '../LoginProvider';
import { allThumbnails, thumbnails } from '../../apis/files/files';

const Sidebar = ({ onSelectAlbum, fetchAllThumbnails, currentAlbum, currentAlbumNo, setCurrentAlbumNo, isAllAlbumsActive, setIsAllAlbumsActive }) => {
  const { userInfo } = useContext(LoginContext);
  const [albums, setAlbums] = useState([]);
  const [editingAlbum, setEditingAlbum] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [selectedAlbumNo, setSelectedAlbumNo] = useState(null);
  const [currentThumbnails, setCurrentThumbnails] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);  // 로딩 상태 관리
// 사용자 앨범 목록 불러오기
useEffect(() => {
    if (userInfo && userInfo.userNo) {
      getAlbumsByUserNo(userInfo.userNo)
        .then(response => {
          setAlbums(response.data);

          // 첫 번째 앨범을 기본 선택 (selectedAlbumNo와 currentAlbumNo 일관성 유지)
          if (response.data.length > 0) {
            const firstAlbum = response.data[0];
            setSelectedAlbumNo(firstAlbum.albumsNo);
            setCurrentAlbumNo(firstAlbum.albumsNo); // currentAlbumNo 설정
            onSelectAlbum(firstAlbum.albumsNo);
            localStorage.setItem("selectedAlbumNo", firstAlbum.albumsNo);
          }
        })
        .catch(error => console.error('앨범 목록 불러오기 중 오류:', error));
    }
  }, [userInfo]);

  // 앨범의 썸네일 조회 함수
  const fetchThumbnails = async (albumNo) => {
    setLoading(true);
    try {
      const data = await thumbnails(albumNo, userInfo.accessToken);
      setCurrentThumbnails(data.thumbnails || []);
    } catch (error) {
      console.error("Error fetching album thumbnails:", error);
    } finally {
      setLoading(false);
    }
  };

  // 전체 앨범 클릭 시 썸네일 조회
  const handleAllAlbumsClick = () => {

    setIsAllAlbumsActive(true);
    setSelectedAlbumNo(null);
    setCurrentAlbumNo(null);
    fetchAllThumbnails();

      console.log("전체 앨범 클릭됨");
      console.log("userInfo:", userInfo);

      if (userInfo && userInfo.userNo && userInfo.accessToken) {
          console.log("allThumbnails 호출 준비 완료");
          setIsAllAlbumsActive(true); // 전체 앨범이 선택되었음을 표시
          setSelectedAlbumNo(null); // 선택된 앨범 해제
          setCurrentAlbumNo(null); // 현재 앨범 선택 해제
          fetchAllThumbnails();
      } else {
          console.log("사용자 정보가 없습니다."); // userInfo가 없는 경우 로그 출력
      }

  };


  const handleAlbumClick = (albumNo) => {

    setIsAllAlbumsActive(false); // 전체 앨범 비활성화
    setSelectedAlbumNo(albumNo);
    setCurrentAlbumNo(albumNo);  // currentAlbumNo 설정
    fetchThumbnails(albumNo);     // 썸네일을 먼저 불러온 후
    onSelectAlbum(albumNo);       // 앨범 선택 처리
    navigate(`/albums/${albumNo}`); // 앨범 페이지로 이동
  };  

   // currentAlbumNo가 업데이트될 때마다 썸네일 조회
   useEffect(() => {
    if (userInfo && currentAlbumNo) {
      fetchThumbnails(currentAlbumNo);
    }
  }, [currentAlbumNo, userInfo]);

  
  // 전체 앨범의 썸네일 조회
  useEffect(() => {
    if (userInfo && userInfo.accessToken) {
      console.log("fetchAllThumbnails 호출 준비 완료.");

      if (fetchAllThumbnails) {
        fetchAllThumbnails(); // 전체 앨범 썸네일 불러오기
      }

    } else {
      console.log("사용자 정보가 없습니다.");  // userInfo가 없는 경우 로그 출력
    }
  }, [userInfo]);

  // 앨범 추가 함수
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

  // 앨범 제목 저장 함수 
  const handleSaveClick = async (albumsNo) => {
    const targetAlbumNo = albumsNo || editingAlbum;
    
    if (!targetAlbumNo) {
      console.error("앨범 번호가 유효하지 않습니다.");
      return;
    }
  
    try {
      const updatedAlbum = await updateAlbumTitle(albumsNo, { title: newTitle });
      setAlbums(albums.map(album => (album.albumsNo === albumsNo ? updatedAlbum.data : album)));
      setEditingAlbum(null);
    } catch (error) {
      console.error("앨범 제목 수정 중 오류:", error);
    }
  };  

  // 앨범 삭제 함수
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

  // 전체 앨범의 썸네일 조회
  useEffect(() => {
    console.log("현재 앨범 썸네일 상태:", currentThumbnails); // 상태 변화 로그
  }, [currentThumbnails]);

  useEffect(() => {
      console.log("현재 앨범 번호:", currentAlbumNo);
      if (userInfo) {
          if (currentAlbumNo) {
              fetchThumbnails(currentAlbumNo);
          } else {
              fetchAllThumbnails();
          }
      } else {
          console.log("사용자 정보가 없습니다.");
      }
  }, [currentAlbumNo, userInfo, isAllAlbumsActive]);

  useEffect(() => {
    if (userInfo && fetchAllThumbnails && typeof fetchAllThumbnails === 'function') {
            fetchAllThumbnails();
        }
  }, [userInfo]);

  const handleCalendarClick = () => {
    console.log('캘린더로 보기 버튼 클릭됨!!!!!!!!', userInfo);
    navigate('/calendar', { state: { userInfo } });
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
        <div className="mb-4">
          <button 
            className={`flex items-center space-x-2 w-full text-left rounded p-2 ${isAllAlbumsActive ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            onClick={handleAllAlbumsClick}
          >
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
      <button onClick={handleCalendarClick} className="p-2 w-full bg-black text-white text-center rounded">
        캘린더로 보기
      </button>
      </div>
    </div>
  );
};

export default Sidebar;
