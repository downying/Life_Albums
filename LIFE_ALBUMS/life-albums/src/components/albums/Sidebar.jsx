import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleCalendarClick = () => {
    navigate('/calendar');
  };

  return (
    <div className="w-64 bg-white text-black p-4 flex flex-col justify-between">
      <div>
        <div className="mb-4 hover:bg-gray-100 hover:rounded-lg p-2">
          <button className="flex items-center space-x-2 w-full text-left rounded">
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

        <div className="mb-4 hover:bg-gray-100 hover:rounded-lg p-2">
          <div className="flex items-center justify-between rounded">
            <span>새 앨범 1</span>
            <FontAwesomeIcon icon={faEdit} />
          </div>
        </div>

        <div className="mb-4 hover:bg-gray-100 hover:rounded-lg p-2">
          <div className="flex items-center justify-between rounded">
            <span>새 앨범 2</span>
            <FontAwesomeIcon icon={faEdit} />
          </div>
        </div>
      </div>

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
