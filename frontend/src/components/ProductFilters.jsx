import React, { useState, useEffect } from 'react';
import { FaFilter, FaChevronDown, FaChevronUp, FaTimes } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { formatPrice } from '../utils/formatters';

const ProductFilters = ({
  categories,
  selectedCategories,
  priceRange,
  maxPrice,
  onCategoryChange,
  onPriceRangeChange,
  onClearFilters,
  isFilterOpen,
  toggleFilter,
}) => {
  const [localPriceRange, setLocalPriceRange] = useState(priceRange);
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
  });

  useEffect(() => {
    setLocalPriceRange(priceRange);
  }, [priceRange]);

  const handlePriceChange = (value) => {
    setLocalPriceRange(value);
  };

  const handlePriceChangeComplete = (value) => {
    onPriceRangeChange(value);
  };

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  return (
    <div className="relative">
      {/* Mobile Filter Button */}
      <button
        onClick={toggleFilter}
        className="md:hidden flex items-center justify-center bg-highlight-500 text-white px-4 py-2 rounded-lg mb-4 w-full"
      >
        <FaFilter className="mr-2" />
        <span>Filters</span>
      </button>

      {/* Filter Panel */}
      <div
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transition-all duration-300 transform ${
          isFilterOpen
            ? 'translate-x-0 opacity-100'
            : '-translate-x-full opacity-0 md:translate-x-0 md:opacity-100'
        } ${
          isFilterOpen
            ? 'fixed inset-0 z-50 overflow-auto md:relative md:inset-auto'
            : 'hidden md:block'
        }`}
      >
        {/* Mobile Header */}
        <div className="flex justify-between items-center mb-4 md:hidden">
          <h2 className="text-lg font-semibold">Filters</h2>
          <button
            onClick={toggleFilter}
            className="text-gray-500 hover:text-gray-700 p-1"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Clear Filters Button */}
        <button
          onClick={onClearFilters}
          className="w-full mb-4 px-4 py-2 border border-highlight-500 text-highlight-500 rounded hover:bg-highlight-50 dark:hover:bg-highlight-900 transition-colors duration-200"
        >
          Clear All Filters
        </button>

        {/* Categories Section */}
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
          <div
            className="flex justify-between items-center cursor-pointer mb-2"
            onClick={() => toggleSection('categories')}
          >
            <h3 className="font-medium text-gray-800 dark:text-white">Categories</h3>
            {expandedSections.categories ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          
          {expandedSections.categories && (
            <div className="mt-2 space-y-2">
              {categories.map((category) => (
                <label
                  key={category.id}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => onCategoryChange(category.id)}
                    className="rounded border-gray-300 text-highlight-500 focus:ring-highlight-500"
                  />
                  <span className="text-gray-700 dark:text-gray-300">
                    {category.name}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Price Range Section */}
        <div className="mb-6">
          <div
            className="flex justify-between items-center cursor-pointer mb-2"
            onClick={() => toggleSection('price')}
          >
            <h3 className="font-medium text-gray-800 dark:text-white">Price Range</h3>
            {expandedSections.price ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          
          {expandedSections.price && (
            <div className="mt-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400">
                  {formatPrice(localPriceRange[0])}
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  {formatPrice(localPriceRange[1])}
                </span>
              </div>
              
              <Slider
                range
                min={0}
                max={maxPrice}
                value={localPriceRange}
                onChange={handlePriceChange}
                onAfterChange={handlePriceChangeComplete}
                trackStyle={[{ backgroundColor: 'var(--highlight-500)' }]}
                handleStyle={[
                  {
                    borderColor: 'var(--highlight-500)',
                    backgroundColor: 'var(--highlight-500)',
                  },
                  {
                    borderColor: 'var(--highlight-500)',
                    backgroundColor: 'var(--highlight-500)',
                  },
                ]}
                railStyle={{ backgroundColor: '#e5e7eb' }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductFilters; 