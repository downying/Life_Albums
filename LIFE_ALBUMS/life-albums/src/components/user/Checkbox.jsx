import React from 'react';

const Checkbox = ({ label, className }) => {
  return (
    <label className={`inline-flex items-center ${className}`}>
      <input type="checkbox" className="form-checkbox h-3 w-3 text-gray-600" />
      <span className="ml-2 whitespace-nowrap">{label}</span>
    </label>
  );
};

export default Checkbox;
