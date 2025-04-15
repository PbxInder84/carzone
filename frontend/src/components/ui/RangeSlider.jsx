import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

/**
 * A dual-thumb range slider component with glassmorphism styling
 */
const RangeSlider = ({ 
  min = 0,
  max = 100,
  value = [min, max],
  step = 1,
  onChange,
  onChangeComplete,
  className = ''
}) => {
  const [range, setRange] = useState(value);
  const [isDragging, setIsDragging] = useState(null);
  const trackRef = useRef(null);
  const isDraggingRef = useRef(false);
  
  // Update internal state when external value changes
  useEffect(() => {
    if (
      value &&
      (value[0] !== range[0] || value[1] !== range[1]) &&
      !isDraggingRef.current
    ) {
      setRange(value);
    }
  }, [value, range]);
  
  // Calculate percentage position for styling and positioning
  const getPercentage = (value) => {
    return ((value - min) / (max - min)) * 100;
  };
  
  // Calculate value based on position percentage
  const getValueFromPosition = (positionX) => {
    const trackRect = trackRef.current.getBoundingClientRect();
    const offsetX = positionX - trackRect.left;
    const percentage = (offsetX / trackRect.width) * 100;
    
    // Constrain percentage between 0 and 100
    const clampedPercentage = Math.min(Math.max(percentage, 0), 100);
    
    // Calculate the actual value based on the percentage
    let value = min + (clampedPercentage / 100) * (max - min);
    
    // Apply step if provided
    if (step) {
      value = Math.round(value / step) * step;
    }
    
    return Math.min(Math.max(value, min), max);
  };
  
  // Handle mouse down on thumb
  const handleThumbMouseDown = (index, e) => {
    e.preventDefault();
    setIsDragging(index);
    isDraggingRef.current = true;
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };
  
  // Handle touch start on thumb
  const handleThumbTouchStart = (index, e) => {
    setIsDragging(index);
    isDraggingRef.current = true;
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);
  };
  
  // Handle mouse move during drag
  const handleMouseMove = (e) => {
    if (isDragging !== null) {
      const value = getValueFromPosition(e.clientX);
      updateRangeValue(isDragging, value);
    }
  };
  
  // Handle touch move during drag
  const handleTouchMove = (e) => {
    if (isDragging !== null && e.touches[0]) {
      const value = getValueFromPosition(e.touches[0].clientX);
      updateRangeValue(isDragging, value);
    }
  };
  
  // Handle mouse up after drag
  const handleMouseUp = () => {
    if (isDragging !== null) {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      isDraggingRef.current = false;
      setIsDragging(null);
      
      // Call onChangeComplete callback when dragging ends
      if (onChangeComplete) {
        onChangeComplete(range);
      }
    }
  };
  
  // Handle touch end after drag
  const handleTouchEnd = () => {
    if (isDragging !== null) {
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      isDraggingRef.current = false;
      setIsDragging(null);
      
      // Call onChangeComplete callback when dragging ends
      if (onChangeComplete) {
        onChangeComplete(range);
      }
    }
  };
  
  // Update range value based on thumb index and new value
  const updateRangeValue = (index, value) => {
    const newRange = [...range];
    
    if (index === 0) {
      // Ensure min thumb doesn't go past max thumb - 1 step
      newRange[0] = Math.min(value, newRange[1] - (step || 1));
    } else {
      // Ensure max thumb doesn't go before min thumb + 1 step
      newRange[1] = Math.max(value, newRange[0] + (step || 1));
    }
    
    setRange(newRange);
    
    if (onChange) {
      onChange(newRange);
    }
  };
  
  // Handle click on track to move closest thumb
  const handleTrackClick = (e) => {
    const value = getValueFromPosition(e.clientX);
    
    // Determine which thumb to move based on proximity to clicked position
    const distToMin = Math.abs(value - range[0]);
    const distToMax = Math.abs(value - range[1]);
    
    if (distToMin <= distToMax) {
      updateRangeValue(0, value);
    } else {
      updateRangeValue(1, value);
    }
    
    // Call onChangeComplete callback when clicked
    if (onChangeComplete) {
      onChangeComplete(range);
    }
  };
  
  return (
    <div className={`relative py-4 ${className || ''}`}>
      {/* Current value display */}
      <div className="flex justify-between mb-2 text-sm font-medium text-gray-700">
        <div>${Math.round(range[0])}</div>
        <div>${Math.round(range[1])}</div>
      </div>
      
      {/* Track */}
      <div 
        ref={trackRef}
        className="relative h-2 bg-gray-200/80 rounded-full cursor-pointer"
        onClick={handleTrackClick}
      >
        {/* Active track segment */}
        <div 
          className="absolute h-full bg-primary-500/80 rounded-full"
          style={{
            left: `${getPercentage(range[0])}%`,
            width: `${getPercentage(range[1]) - getPercentage(range[0])}%`
          }}
        />
        
        {/* Min thumb */}
        <div 
          className={`absolute w-5 h-5 top-1/2 -mt-2.5 -ml-2.5 rounded-full bg-white border-2 border-primary-500 cursor-grab shadow-lg 
            ${isDragging === 0 ? 'cursor-grabbing z-30' : 'z-20'}`}
          style={{ left: `${getPercentage(range[0])}%` }}
          onMouseDown={(e) => handleThumbMouseDown(0, e)}
          onTouchStart={(e) => handleThumbTouchStart(0, e)}
        />
        
        {/* Max thumb */}
        <div 
          className={`absolute w-5 h-5 top-1/2 -mt-2.5 -ml-2.5 rounded-full bg-white border-2 border-primary-500 cursor-grab shadow-lg 
            ${isDragging === 1 ? 'cursor-grabbing z-30' : 'z-20'}`}
          style={{ left: `${getPercentage(range[1])}%` }}
          onMouseDown={(e) => handleThumbMouseDown(1, e)}
          onTouchStart={(e) => handleThumbTouchStart(1, e)}
        />
      </div>
    </div>
  );
};

RangeSlider.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  value: PropTypes.arrayOf(PropTypes.number),
  step: PropTypes.number,
  onChange: PropTypes.func,
  onChangeComplete: PropTypes.func,
  className: PropTypes.string
};

RangeSlider.defaultProps = {
  min: 0,
  max: 100,
  value: null,
  step: 1,
  className: ''
};

export default RangeSlider; 