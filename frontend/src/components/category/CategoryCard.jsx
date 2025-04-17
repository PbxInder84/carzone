import React from 'react';
import { Link } from 'react-router-dom';
import { FaTag } from 'react-icons/fa';

const CategoryCard = ({ category }) => {
  // Default icon if none is provided in the category object
  const defaultIcon = <FaTag />;
  
  return (
    <Link 
      to={`/products?category=${category.id}`}
      className="block h-full"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col items-center text-center p-5 border border-gray-200 dark:border-gray-700">
        {/* Icon */}
        <div className="bg-slate-100 dark:bg-gray-700 text-highlight-500 rounded-full p-3 mb-4">
          {category.icon || defaultIcon}
        </div>
        
        {/* Category name */}
        <h3 className="font-semibold text-lg mb-2 text-slate-800 dark:text-white">
          {category.name}
        </h3>
        
        {/* Description */}
        <p className="text-slate-600 dark:text-gray-300 text-sm line-clamp-2 mb-4">
          {category.description || `Explore our ${category.name} collection`}
        </p>
        
        {/* Image if available */}
        {category.image_url && (
          <div className="mt-auto w-full pt-3">
            <img 
              src={category.image_url} 
              alt={category.name}
              className="w-full h-24 object-cover rounded-md"
            />
          </div>
        )}
        
        {/* CTA Text */}
        <span className="mt-auto pt-3 text-highlight-500 text-sm font-medium">
          Explore products
        </span>
      </div>
    </Link>
  );
};

export default CategoryCard; 