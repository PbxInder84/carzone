import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaStar, FaShoppingCart } from 'react-icons/fa';
import { addToCart } from '../../features/cart/cartSlice';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const handleAddToCart = () => {
    if (!user) {
      toast.info('Please login to add items to cart');
      return;
    }
    
    dispatch(addToCart({
      product_id: product.id,
      quantity: 1
    }))
      .unwrap()
      .then(() => {
        toast.success('Item added to cart');
      })
      .catch((error) => {
        toast.error(error);
      });
  };
  
  // Calculate average rating if reviews exist
  const avgRating = product.reviews && product.reviews.length > 0
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
    : 0;
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
      <Link to={`/products/${product.id}`}>
        <div className="h-48 overflow-hidden">
          <img 
            src={product.image_url || 'https://via.placeholder.com/300x200?text=No+Image'} 
            alt={product.name}
            className="w-full h-full object-cover object-center transform hover:scale-105 transition duration-300"
          />
        </div>
      </Link>
      
      <div className="p-4">
        <Link to={`/products/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-800 hover:text-primary-600 transition duration-300 mb-1 truncate">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <FaStar 
                key={i} 
                className={`${
                  i < Math.round(avgRating) 
                    ? 'text-yellow-400' 
                    : 'text-gray-300'
                } mr-1`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-1">
            {product.reviews ? `(${product.reviews.length})` : '(0)'}
          </span>
        </div>
        
        <div className="text-gray-600 text-sm h-12 overflow-hidden mb-3">
          {product.description?.substring(0, 60)}
          {product.description?.length > 60 ? '...' : ''}
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-primary-700">
            ${parseFloat(product.price).toFixed(2)}
          </span>
          
          <button
            onClick={handleAddToCart}
            className="bg-secondary-600 hover:bg-secondary-700 text-white p-2 rounded-full transition duration-300"
            disabled={product.stock_quantity < 1}
            title={product.stock_quantity < 1 ? 'Out of stock' : 'Add to cart'}
          >
            <FaShoppingCart className="text-lg" />
          </button>
        </div>
        
        {product.stock_quantity < 1 && (
          <p className="text-red-500 text-sm mt-2">Out of stock</p>
        )}
        {product.stock_quantity > 0 && product.stock_quantity < 5 && (
          <p className="text-orange-500 text-sm mt-2">Only {product.stock_quantity} left in stock</p>
        )}
      </div>
    </div>
  );
};

export default ProductCard; 