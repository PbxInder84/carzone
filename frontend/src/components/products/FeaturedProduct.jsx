import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaEye, FaArrowRight } from 'react-icons/fa';
import { formatCurrency } from '../../utils/formatters';

const FeaturedProduct = ({ product }) => {
  if (!product) return null;
  
  // Ensure product has featured property
  const enhancedProduct = {
    ...product,
    featured: true  // Explicitly set this for UI rendering if needed
  };
  
  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-700 hover:border-highlight-500 dark:hover:border-highlight-500 transition-all duration-300">
      <div className="flex flex-col md:flex-row">
        {/* Product image */}
        <div className="relative md:w-1/2 overflow-hidden group">
          <div className="absolute top-4 left-4 z-10 bg-highlight-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <FaStar className="mr-1" /> Popular
          </div>
          
          {/* Discount tag if applicable */}
          {enhancedProduct.original_price && enhancedProduct.original_price > enhancedProduct.price && (
            <div className="absolute top-4 right-4 z-10 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-medium">
              {Math.round(((enhancedProduct.original_price - enhancedProduct.price) / enhancedProduct.original_price) * 100)}% OFF
            </div>
          )}
          
          <img 
            src={enhancedProduct.image_url || '/images/placeholder-product.jpg'} 
            alt={enhancedProduct.name}
            className="w-full h-80 md:h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Link 
              to={`/products/${enhancedProduct.id}`}
              className="bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-white p-3 rounded-full mx-2 hover:bg-highlight-500 hover:text-white transition-colors duration-300"
            >
              <FaEye />
            </Link>
            <button 
              className="bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-white p-3 rounded-full mx-2 hover:bg-highlight-500 hover:text-white transition-colors duration-300"
            >
              <FaShoppingCart />
            </button>
          </div>
        </div>
        
        {/* Product details */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
          <div className="mb-2">
            {enhancedProduct.category && (
              <span className="text-highlight-500 text-sm font-medium">
                {enhancedProduct.category.name}
              </span>
            )}
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white hover:text-highlight-500 dark:hover:text-highlight-500 transition-colors duration-300 mt-1">
              <Link to={`/products/${enhancedProduct.id}`}>
                {enhancedProduct.name}
              </Link>
            </h3>
          </div>
          
          {/* Rating stars */}
          <div className="flex items-center mb-4">
            {Array(5).fill(0).map((_, index) => (
              <FaStar 
                key={index} 
                className={`${
                  index < Math.floor(enhancedProduct.rating || 0) 
                    ? 'text-yellow-400' 
                    : 'text-gray-300 dark:text-gray-600'
                } w-5 h-5`} 
              />
            ))}
            <span className="ml-2 text-gray-600 dark:text-gray-400 text-sm">
              ({enhancedProduct.reviews?.length || 0} reviews)
            </span>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 text-base mb-6 line-clamp-3">
            {enhancedProduct.description}
          </p>
          
          <div className="flex items-center mb-6">
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-highlight-500">
                {formatCurrency(enhancedProduct.price)}
              </span>
              {enhancedProduct.original_price && enhancedProduct.original_price > enhancedProduct.price && (
                <span className="text-base text-gray-500 dark:text-gray-400 line-through ml-2">
                  {formatCurrency(enhancedProduct.original_price)}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex gap-3">
            <button className="flex-1 py-3 bg-highlight-500 hover:bg-highlight-600 text-white rounded-lg transition-all duration-300 flex items-center justify-center">
              <FaShoppingCart className="mr-2" /> Add to Cart
            </button>
            
            <Link 
              to={`/products/${enhancedProduct.id}`}
              className="px-5 py-3 border-2 border-highlight-500 text-highlight-500 hover:bg-highlight-500 hover:text-white rounded-lg transition-all duration-300 flex items-center justify-center"
            >
              Details <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProduct; 