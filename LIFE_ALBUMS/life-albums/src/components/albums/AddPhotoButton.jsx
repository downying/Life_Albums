import React from 'react';

const AddPhotoButton = ({ onClick }) => {
    return (
        <button onClick={onClick} className="w-[150px] h-[150px] border-2 border-dashed border-gray-400 flex justify-center items-center text-4xl text-gray-500">
            +
        </button>
    );
};

export default AddPhotoButton;
