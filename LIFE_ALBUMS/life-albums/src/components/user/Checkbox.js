import React from 'react';

const Checkbox = ({ label }) => {
  return (
    <div className="flex items-center">
      <input type="checkbox" id="remember" className="mr-2" />
      <label htmlFor="remember">{label}</label>
    </div>
  );
};

export default Checkbox;
