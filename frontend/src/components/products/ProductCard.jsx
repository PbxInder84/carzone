import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { addToCart } from '../../features/cart/cartSlice';
import { FaStar, FaRegStar, FaStarHalfAlt, FaShoppingCart, FaHeart, FaEye } from 'react-icons/fa';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }

    dispatch(addToCart({ productId: product.id, quantity: 1 }))
      .unwrap()
      .then(() => {
        toast.success('Product added to cart');
      })
      .catch((error) => {
        toast.error(error || 'Failed to add product to cart');
      });
  };

  // Calculate average rating
  const calculateRating = () => {
    if (!product.reviews || product.reviews.length === 0) {
      return 0;
    }
    
    const sum = product.reviews.reduce((total, review) => total + review.rating, 0);
    return sum / product.reviews.length;
  };
  
  const averageRating = calculateRating();
  
  // Generate star ratings
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(averageRating);
    const halfStar = averageRating - fullStars >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars + 1 && halfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }
    
    return stars;
  };

  return (
    <div className="group relative overflow-hidden backdrop-blur-sm bg-white/90 rounded-xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Sale badge */}
      {product.discount_percent > 0 && (
        <div className="absolute top-3 left-3 z-10 bg-secondary-500 text-white text-xs font-bold py-1 px-2 rounded-full">
          {product.discount_percent}% OFF
        </div>
      )}
      
      {/* Stock indicator */}
      <div className="absolute top-3 right-3 z-10">
        {product.stock > 10 ? (
          <span className="bg-green-100 text-green-700 text-xs py-1 px-2 rounded-full flex items-center">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block mr-1"></span>
            In Stock
          </span>
        ) : product.stock > 0 ? (
          <span className="bg-amber-100 text-amber-700 text-xs py-1 px-2 rounded-full flex items-center">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full inline-block mr-1"></span>
            Low Stock
          </span>
        ) : (
          <span className="bg-red-100 text-red-700 text-xs py-1 px-2 rounded-full flex items-center">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full inline-block mr-1"></span>
            Out of Stock
          </span>
        )}
      </div>
      
      {/* Quick action buttons - visible on hover */}
      <div className="absolute right-3 top-1/3 transform -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-2">
        <button 
          className="w-9 h-9 bg-white shadow-md rounded-full flex items-center justify-center text-primary-600 hover:bg-primary-50 transition-colors duration-300"
          title="Add to Wishlist"
        >
          <FaHeart className="text-sm" />
        </button>
        <button 
          className="w-9 h-9 bg-white shadow-md rounded-full flex items-center justify-center text-primary-600 hover:bg-primary-50 transition-colors duration-300"
          title="Quick View"
        >
          <FaEye className="text-sm" />
        </button>
      </div>
      
      {/* Product Image with overlay on hover */}
      <div className="relative overflow-hidden h-48 sm:h-56">
        <Link to={`/product/${product.id}`}>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <img 
            src={product.image_url || 'https://via.placeholder.com/300'} 
            alt={product.name}
            className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-500"
          />
        </Link>
      </div>
      
      {/* Product Info */}
      <div className="p-4">
        {/* Category */}
        {product.category && (
          <Link to={`/products?category=${product.category.id}`} className="text-xs text-primary-600 hover:text-primary-700 font-medium">
            {product.category.name}
          </Link>
        )}
        
        {/* Product Name */}
        <Link to={`/product/${product.id}`} className="block mt-1">
          <h3 className="text-lg font-medium text-gray-800 hover:text-primary-600 transition-colors duration-300 line-clamp-1">
            {product.name}
          </h3>
        </Link>
        
        {/* Description - limited to 2 lines */}
        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
          {product.description}
        </p>
        
        {/* Rating and Reviews */}
        <div className="mt-2 flex items-center">
          <div className="flex">
            {renderStars()}
          </div>
          <span className="ml-1 text-xs text-gray-500">
            ({product.reviews ? product.reviews.length : 0})
          </span>
        </div>
        
        {/* Price and Add to Cart */}
        <div className="mt-3 flex items-center justify-between">
          <div>
            {product.discount_percent > 0 ? (
              <div className="flex flex-col">
                <span className="text-lg font-bold text-primary-600">
                  ${(parseFloat(product.price || 0) * (1 - product.discount_percent / 100)).toFixed(2)}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  ${parseFloat(product.price || 0).toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="text-lg font-bold text-primary-600">
                ${parseFloat(product.price || 0).toFixed(2)}
              </span>
            )}
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`${
              product.stock === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-primary-600 hover:bg-primary-700'
            } text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md transform transition-transform duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
            title={product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          >
            <FaShoppingCart />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 