import React from 'react';

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  const pageNumbers = [];

  // 페이지 번호 리스트 생성
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center items-center space-x-2 mt-4">
      {/* 첫 페이지로 이동 버튼 */}
      <button
        onClick={() => onPageChange(1)}
        className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 bg-white text-black hover:bg-gray-200"
        disabled={currentPage === 1}
      >
        «
      </button>

      {/* 이전 페이지로 이동 버튼 */}
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 bg-white text-black hover:bg-gray-200"
        disabled={currentPage === 1}
      >
        ‹
      </button>

      {/* 페이지 번호 버튼 */}
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`w-8 h-8 flex items-center justify-center rounded-full border ${
            currentPage === number
              ? 'bg-black text-white border-black'
              : 'bg-white text-black border-gray-300 hover:bg-gray-200'
          } `}  
        >
          {number}
        </button>
      ))}

      {/* 다음 페이지로 이동 버튼 */}
      <button
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 bg-white text-black hover:bg-gray-200"
        disabled={currentPage === totalPages}
      >
        ›
      </button>

      {/* 마지막 페이지로 이동 버튼 */}
      <button
        onClick={() => onPageChange(totalPages)}
        className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 bg-white text-black hover:bg-gray-200"
        disabled={currentPage === totalPages}
      >
        »
      </button>
    </div>
  );
};

export default Pagination;
