import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { deleteFile, getFile, updateFile } from '../../apis/files/files';

const Modal = ({ fileNo, isOpen, onClose, onDelete, onUpdate, token, onRegister, check }) => {
  const [album, setAlbum] = useState({ imgSrc: '', date: new Date().toISOString().split('T')[0], memo: '', file: null });
  const [previousDate, setPreviousDate] = useState(''); // 이전 날짜 저장
  const [previousMemo, setPreviousMemo] = useState(''); // 이전 메모 저장
  const [updateSuccess, setUpdateSuccess] = useState(false); // 수정 성공 상태

  useEffect(() => {
    if (isOpen && fileNo && !check) {
      getFile(fileNo, token)
        .then((data) => {
          console.log("불러온 파일 데이터:", data);
          
          const formattedDate = (data.year && data.month && data.day)
            ? `${data.year}-${String(data.month).padStart(2, '0')}-${String(data.day).padStart(2, '0')}`
            : new Date().toISOString().split('T')[0];
          
          setPreviousDate(formattedDate);
          setPreviousMemo(data.content);
  
          setAlbum({
            imgSrc: data.filePath,
            date: formattedDate,
            memo: data.content,
          });
        })
        .catch((error) => console.error("파일 불러오기 오류:", error));
    } else if (check) {
      setAlbum({ imgSrc: '', date: new Date().toISOString().split('T')[0], memo: '', file: null });
    }
  }, [fileNo, isOpen, token, check]);
  
  // 파일 업데이트 핸들러
  const handleUpdate = async () => {
    if (check) {
      await onRegister(album);
      onClose();
    } else {
      try {
        const updatedFile = {
          fileNo,
          year: album.date.split('-')[0],
          month: album.date.split('-')[1],
          day: album.date.split('-')[2],
          memo: album.memo,
        };
        
        await updateFile(fileNo, updatedFile, token);
        alert("파일이 수정되었습니다.");
        
        // onUpdate 호출
        onUpdate(updatedFile); // 추가
        setUpdateSuccess(true); // 수정 성공 상태 업데이트
        onClose();
      } catch (error) {
        console.error("파일 업데이트 중 오류 발생:", error);
        alert("파일 업데이트에 실패했습니다.");
      }
    }
  };
  
  // 수정 성공 시 새로고침
  useEffect(() => {
    if (updateSuccess) {
      window.location.reload(); // 새로고침
    }
  }, [updateSuccess]);

  // 파일 삭제 핸들러
  const handleDelete = async () => {
    if (window.confirm("정말로 삭제하시겠습니까?")) {
      try {
        await deleteFile(fileNo, token);
        onDelete();
      } catch (error) {
        console.error("파일 삭제 중 오류:", error);
      }
      onClose();
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setAlbum((prevAlbum) => ({
      ...prevAlbum,
      file: selectedFile,  // 실제 파일 객체 저장
      imgSrc: URL.createObjectURL(selectedFile)  // 이미지 미리보기
    }));
  };
  
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-[53%] h-[55%] p-6 rounded-lg shadow-lg relative flex">
        <button
          className="absolute top-2 right-2 text-gray-600"
          onClick={onClose}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <div className="w-[50%] flex flex-col items-center justify-center">
          {album.imgSrc ? (
            <img
              src={album.imgSrc}
              alt="Album"
              className="w-[300px] h-[400px] object-contain rounded-lg shadow-md"
            />
          ) : (
            <div className="w-[300px] h-[400px] bg-gray-200 flex items-center justify-center rounded-lg shadow-md">
              <span>No Image</span>
            </div>
          )}
          {check && (
            <input
              type="file"
              onChange={handleFileChange}
              className="mt-4"
            />
          )}
        </div>

        <div className="w-1/2 flex flex-col justify-between p-4">
          <div className="flex flex-col space-y-2">
            <label className="text-gray-700">날짜</label>
            <input
              type="date"
              value={album.date}
              onChange={(e) => setAlbum({ ...album, date: e.target.value })}
              className="border p-2 rounded w-full"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-gray-700">메모</label>
            <textarea
              placeholder="메모를 입력하세요"
              value={album.memo || ''}
              onChange={(e) => setAlbum({ ...album, memo: e.target.value })}
              className="border p-2 rounded w-full h-[200px] resize-none"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleUpdate}
            >
              {check ? '등록' : '수정'}
            </button>
            {!check && (
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={handleDelete}
              >
                삭제
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
