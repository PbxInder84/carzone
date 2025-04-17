import React, { useState, useEffect, useRef } from 'react';
import { FaChevronLeft, FaChevronRight, FaPlay, FaPause } from 'react-icons/fa';

const ProductSlider = ({ slides = [], autoPlaySpeed = 5000 }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const slideInterval = useRef(null);
  const progressRef = useRef(null);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const toggleAutoPlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Reset animation when slide changes
  useEffect(() => {
    if (progressRef.current) {
      progressRef.current.style.animation = 'none';
      // Trigger reflow to restart animation
      void progressRef.current.offsetWidth;
      progressRef.current.style.animation = `progressBar ${autoPlaySpeed/1000}s linear`;
    }
  }, [currentSlide, autoPlaySpeed]);

  // Handle autoplay
  useEffect(() => {
    if (isPlaying) {
      slideInterval.current = setInterval(() => {
        nextSlide();
      }, autoPlaySpeed);
    } else {
      clearInterval(slideInterval.current);
    }

    return () => {
      clearInterval(slideInterval.current);
    };
  }, [isPlaying, autoPlaySpeed]);

  if (!slides.length) return null;

  return (
    <div className="relative w-full overflow-hidden bg-gray-100 rounded-lg shadow-lg">
      {/* Main slider */}
      <div className="relative h-[400px] md:h-[500px]">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <img
              src={slide.imageUrl}
              alt={slide.title}
              className="object-cover w-full h-full"
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
              <h3 className="text-xl font-bold mb-2">{slide.title}</h3>
              <p className="text-sm">{slide.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-16 left-0 w-full h-1 bg-gray-300/30">
        <div 
          ref={progressRef}
          className="h-full bg-highlight-500 animate-progress-bar" 
          style={{ animationDuration: `${autoPlaySpeed/1000}s` }}
        ></div>
      </div>

      {/* Control panel */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-4 bg-black/40 text-white">
        <button 
          onClick={toggleAutoPlay} 
          className="p-2 rounded-full hover:bg-white/20 transition-colors"
          aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
        >
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        
        <div className="flex items-center space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentSlide ? 'bg-highlight-500' : 'bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={prevSlide}
            className="p-2 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Previous slide"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={nextSlide}
            className="p-2 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Next slide"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductSlider; 