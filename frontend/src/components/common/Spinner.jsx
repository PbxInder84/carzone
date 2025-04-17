import React from 'react';

const Spinner = ({ size = 'default' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    default: 'h-8 w-8 border-4',
    lg: 'h-12 w-12 border-4'
  };
  
  const spinnerSize = sizeClasses[size] || sizeClasses.default;
  
  return (
    <div className="flex justify-center items-center h-full">
      <div className={`${spinnerSize} border-t-primary-500 border-primary-200 border-solid rounded-full animate-spin`}></div>
    </div>
  );
};

export default Spinner; 