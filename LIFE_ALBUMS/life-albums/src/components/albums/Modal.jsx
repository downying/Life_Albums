import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { deleteFile, getFile, updateFile } from '../../apis/files/files';

const Modal = ({ fileNo, isOpen, onClose, onDelete, onUpdate, token, onRegister, check }) => {
  const [album, setAlbum] = useState({ imgSrc: '', date: '', memo: '', file: null });

  useEffect(() => {
    if (isOpen && fileNo && !check) {
      getFile(fileNo, token)
        .then((data) => {
          setAlbum({
            imgSrc: data.filePath,
            date: `${data.year}-${data.month}-${data.day}`,
            memo: data.content,
            file: null
          });
        })
        .catch((error) => console.error("파일 불러오기 오류:", error));
    } else if (check) {
      setAlbum({ imgSrc: '', date: '', memo: '', file: null });
    }
  }, [fileNo, isOpen, token, check]);

  const handleUpdate = async () => {
    try {
      if (!check) {
        await updateFile(fileNo, {
          date: album.date,
          content: album.memo,
          filePath: album.imgSrc,
        }, token);
        onUpdate(album);
      } else {
        onRegister(album);
      }
    } catch (error) {
      console.error("파일 수정/등록 중 오류:", error);
    }
    onClose();
  };

  const handleDelete = async () => {
    try {
      await deleteFile(fileNo, token);
      onDelete();
    } catch (error) {
      console.error("파일 삭제 중 오류:", error);
    }
    onClose();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setAlbum(prev => ({
      ...prev,
      file: selectedFile,
      imgSrc: URL.createObjectURL(selectedFile)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-[800px] h-[500px] p-6 rounded-lg shadow-lg relative flex">
        <button
          className="absolute top-2 right-2 text-gray-600"
          onClick={onClose}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <div className="w-1/2 flex flex-col items-center justify-center">
          {album.imgSrc ? (
            <img
              src={album.imgSrc}
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