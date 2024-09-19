import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const Modal = ({ album, isOpen, onClose, onDelete, onUpdate, onRegister, check }) => {
  const [localAlbum, setLocalAlbum] = useState(album);
  const [file, setFile] = useState(null);

  useEffect(() => {
    setLocalAlbum(album);
  }, [album]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setLocalAlbum(prev => ({
      ...prev,
      file: selectedFile,
      imgSrc: URL.createObjectURL(selectedFile)
    }));
  };

  const handleSubmit = () => {
    if (check) {
      onRegister(localAlbum);
    } else {
      onUpdate(localAlbum);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-[800px] h-[500px] p-6 rounded-lg shadow-lg relative flex">
        {/* ... 기존 코드 ... */}

        {/* 왼쪽: 사진 */}
        <div className="w-1/2 flex flex-col items-center justify-center">
          {localAlbum.imgSrc ? (
            <img
              src={localAlbum.imgSrc}
              alt="Album"
              className="w-[300px] h-[400px] object-cover rounded-lg shadow-md"
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

        {/* 오른쪽: 날짜, 메모, 버튼 */}
        <div className="w-1/2 flex flex-col justify-between p-4">
          {/* 날짜 입력 */}
          <div className="flex flex-col space-y-2">
            <label className="text-gray-700">날짜</label>
            <input
              type="date"
              value={localAlbum.date}
              onChange={(e) => setLocalAlbum(prev => ({ ...prev, date: e.target.value }))}
              className="border p-2 rounded w-full"
            />
          </div>

          {/* 메모 입력 */}
          <div className="flex flex-col space-y-2">
            <label className="text-gray-700">메모</label>
            <textarea
              placeholder="메모를 입력하세요"
              value={localAlbum.memo || ''}
              onChange={(e) => setLocalAlbum(prev => ({ ...prev, memo: e.target.value }))}
              className="border p-2 rounded w-full h-[200px] resize-none"
            />
          </div>

          {/* 수정, 삭제 버튼 */}
          <div className="flex justify-end space-x-4">
            {!check && (
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={onDelete}
              >
                삭제
              </button>
            )}
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleSubmit}
            >
              {check ? '등록' : '수정'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;