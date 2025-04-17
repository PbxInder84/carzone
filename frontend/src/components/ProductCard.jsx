import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaShoppingCart, FaHeart, FaStar, FaRegHeart } from 'react-icons/fa';
import { addToCart } from '../redux/actions/cartActions';
import { addToWishlist, removeFromWishlist } from '../redux/actions/wishlistActions';
import toast from 'react-hot-toast';
import { formatPrice } from '../utils/formatters';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const isInWishlist = wishlistItems?.some((item) => item.id === product.id);

  const handleAddToCart = () => {
    dispatch(addToCart(product, 1));
    toast.success('Product added to cart!');
  };

  const handleWishlistToggle = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to wishlist');
      return;
    }

    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
      toast.success('Removed from wishlist');
    } else {
      dispatch(addToWishlist(product));
      toast.success('Added to wishlist');
    }
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 group relative h-full flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Wishlist Button */}
      <button
        onClick={handleWishlistToggle}
        className="absolute top-2 right-2 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-sm hover:shadow-md transition duration-300"
      >
        {isInWishlist ? (
          <FaHeart className="text-highlight-500" size={16} />
        ) : (
          <FaRegHeart className="text-gray-400 hover:text-highlight-500" size={16} />
        )}
      </button>

      {/* Product Image */}
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden h-48 md:h-56">
        <img
          src={product.image_url || 'https://via.placeholder.com/300'}
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-500 transform group-hover:scale-105"
        />
        {product.stock_quantity <= 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <span className="text-white font-medium px-3 py-1 rounded">Out of Stock</span>
          </div>
        )}
        {product.featured && (
          <div className="absolute top-3 left-3">
            <span className="bg-highlight-500 text-white text-xs font-bold px-2 py-1 rounded">Featured</span>
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-gray-800 dark:text-white font-medium mb-1 truncate hover:text-highlight-500 dark:hover:text-highlight-400 transition-colors duration-300">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <FaStar
              key={i}
              className={`${
                i < Math.round(product.rating || 0)
                  ? 'text-yellow-400'
                  : 'text-gray-300 dark:text-gray-600'
              } w-3 h-3`}
            />
          ))}
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
            ({product.review_count || 0})
          </span>
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 line-clamp-2 flex-grow">
          {product.description}
        </p>

        <div className="mt-auto pt-2 flex items-end justify-between">
          <span className="font-bold text-gray-800 dark:text-white">
            {formatPrice(product.price)}
          </span>
          
          <button
            onClick={handleAddToCart}
            disabled={product.stock_quantity <= 0}
            className={`${
              product.stock_quantity <= 0
                ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                : 'bg-highlight-500 hover:bg-highlight-600 dark:hover:bg-highlight-400'
            } text-white py-1 px-3 rounded flex items-center text-sm transition-colors duration-300`}
          >
            <FaShoppingCart className="mr-1" size={14} />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 