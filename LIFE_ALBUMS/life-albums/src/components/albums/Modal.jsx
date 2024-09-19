import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { deleteFile, getFile, updateFile } from '../../apis/files/files';

const Modal = ({ fileNo, isOpen, onClose, onDelete, onUpdate, token }) => {
  const [album, setAlbum] = useState({ imgSrc: '', date: '', memo: '' });

  useEffect(() => {
    if (isOpen && fileNo) {
      // fileNo로 데이터를 불러오는 API 호출
      getFile(fileNo, token)
        .then((data) => {
          setAlbum({
            imgSrc: data.filePath,
            date: `${data.year}-${data.month}-${data.day}`,
            memo: data.content,
          });
        })
        .catch((error) => console.error("파일 불러오기 오류:", error));
    }
  }, [fileNo, isOpen, token]);

  const handleUpdate = async () => {
    try {
      await updateFile(fileNo, {
        date: album.date,
        content: album.memo,
        filePath: album.imgSrc,
      }, token);
      onUpdate();  // Trigger update after successful modification
    } catch (error) {
      console.error("파일 수정 중 오류:", error);
    }
    onClose();
  };

  const handleDelete = async () => {
    try {
      await deleteFile(fileNo, token);
      onDelete();  // Trigger deletion after successful operation
    } catch (error) {
      console.error("파일 삭제 중 오류:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-[800px] h-[500px] p-6 rounded-lg shadow-lg relative flex">
        {/* 닫기 버튼 */}
        <button
          className="absolute top-2 right-2 text-gray-600"
          onClick={onClose}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        {/* 왼쪽: 사진 */}
        <div className="w-1/2 flex items-center justify-center">
          <img
            src={album.imgSrc}
            alt="Album"
            className="w-[300px] h-[400px] object-cover rounded-lg shadow-md"
          />
        </div>

        {/* 오른쪽: 날짜, 메모, 버튼 */}
        <div className="w-1/2 flex flex-col justify-between p-4">
          {/* 날짜 입력 */}
          <div className="flex flex-col space-y-2">
            <label className="text-gray-700">날짜</label>
            <input
              type="date"
              value={album.date}
              onChange={(e) => setAlbum({ ...album, date: e.target.value })}
              className="border p-2 rounded w-full"
            />
          </div>

          {/* 메모 입력 */}
          <div className="flex flex-col space-y-2">
            <label className="text-gray-700">메모</label>
            <textarea
              placeholder="메모를 입력하세요"
              value={album.memo || ''}
              onChange={(e) => setAlbum({ ...album, memo: e.target.value })}
              className="border p-2 rounded w-full h-[200px] resize-none"
            />
          </div>

          {/* 수정, 삭제 버튼 */}
          <div className="flex justify-end space-x-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleUpdate}
            >
              수정
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={handleDelete}
            >
              삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
