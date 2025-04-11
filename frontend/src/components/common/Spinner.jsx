import React from 'react';

const Spinner = ({ size = 'medium' }) => {
  const sizeClass = {
    small: 'h-6 w-6 border-2',
    medium: 'h-12 w-12 border-2',
    large: 'h-16 w-16 border-3'
  };
  
  return (
    <div className="flex justify-center items-center py-6">
      <div 
        className={`animate-spin rounded-full ${sizeClass[size]} border-t-primary-600 border-b-primary-600 border-r-transparent border-l-transparent`}
      ></div>
    </div>
  );
};

export default Spinner; 