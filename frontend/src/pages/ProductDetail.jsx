import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaStar, FaShoppingCart, FaArrowLeft, FaPlus, FaMinus, FaCartPlus } from 'react-icons/fa';
import { getProduct, resetProduct } from '../features/products/productSlice';
import { addToCart } from '../features/cart/cartSlice';
import Spinner from '../components/layout/Spinner';
import { getImageUrl } from '../utils/imageUtils';
import ReviewForm from '../components/reviews/ReviewForm';
import { getProductReviews, checkCanReview } from '../features/reviews/reviewSlice';
import { formatCurrency } from '../utils/formatters';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, isLoading } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);
  const { canReview } = useSelector((state) => state.reviews);
  const [quantity, setQuantity] = useState(1);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    dispatch(getProduct(id));
    
    // Cleanup function
    return () => {
      dispatch(resetProduct());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (product && product.id && user) {
      dispatch(checkCanReview(product.id));
      dispatch(getProductReviews(product.id));
    }
  }, [product, user, dispatch]);

  const handleAddToCart = () => {
    if (!user) {
      toast.info('Please login to add items to cart');
      return;
    }
    
    dispatch(addToCart({
      product_id: id,
      quantity: parseInt(quantity)
    }))
      .unwrap()
      .then(() => {
        toast.success('Item added to cart');
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const refreshReviews = () => {
    if (product) {
      dispatch(getProductReviews(product.id));
      // Reload product to get updated reviews
      dispatch(getProduct(id));
    }
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    setIsSubmittingReview(true);
    // Handle form submission
    setIsSubmittingReview(false);
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-md rounded-lg p-6 text-center border border-gray-100 hover:border-highlight-500 transition-all duration-300">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist or has been removed.</p>
          <Link to="/products" className="inline-flex items-center text-highlight-500 hover:text-highlight-700">
            <FaArrowLeft className="mr-2" /> Back to Products
          </Link>
        </div>
      </div>
    );
  }

  // Calculate average rating if reviews exist
  const reviews = product.reviews || [];
  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/products" className="inline-flex items-center text-highlight-500 hover:text-highlight-700 transition-colors duration-300">
          <FaArrowLeft className="mr-2" /> Back to Products
        </Link>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-100 hover:border-highlight-500 transition-all duration-300">
        <div className="md:flex">
          {/* Product Image */}
          <div className="md:w-1/2">
            <div className="h-80 md:h-full overflow-hidden">
              <img 
                src={getImageUrl(product.image_url)} 
                alt={product.name}
                className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/600x400?text=No+Image';
                }}
              />
            </div>
          </div>
          
          {/* Product Details */}
          <div className="md:w-1/2 p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
            
            <div className="flex items-center mb-4">
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
                ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
              </span>
            </div>
            
            <div className="text-2xl font-bold text-highlight-500 mb-4">
              {formatCurrency(parseFloat(product.price))}
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-4">{product.description}</p>
              <p className="text-sm text-gray-500">
                Category: {product.productCategory?.name || 'Uncategorized'}
              </p>
              <p className="text-sm text-gray-500">
                Available: {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of stock'}
              </p>
              <p className="text-sm text-gray-500">
                Seller: {product.seller?.name || 'Unknown'}
              </p>
            </div>
            
            <div className="flex items-center mb-6">
              <div className="mr-4">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <select
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="mt-1 block w-20 rounded-md border-gray-300 shadow-sm focus:border-highlight-500 focus:ring-highlight-500"
                  disabled={product.stock_quantity <= 0}
                >
                  {[...Array(Math.min(10, product.stock_quantity || 0))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={handleAddToCart}
                disabled={product.stock_quantity <= 0}
                className={`flex items-center px-6 py-3 rounded-md text-white font-medium transition-all duration-300 ${
                  product.stock_quantity > 0
                    ? 'bg-highlight-500 hover:bg-highlight-600'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                <FaShoppingCart className="mr-2" />
                {product.stock_quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </div>
        </div>
        
        {/* Reviews Section */}
        <div className="p-6 border-t border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Customer Reviews</h2>
          
          {/* Only show review form for logged in users who can review */}
          {user && canReview && (
            <form onSubmit={handleSubmitReview} className="mb-8 bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-highlight-500 transition-all duration-300">
              <h4 className="text-md font-medium text-gray-800 mb-3">Write a Review</h4>
              <div className="mb-4">
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
                  Rating
                </label>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setReviewRating(i + 1)}
                      className="focus:outline-none"
                    >
                      <FaStar 
                        className={`${
                          i < reviewRating 
                            ? 'text-yellow-400' 
                            : 'text-gray-300'
                        } text-xl mr-1 transition-colors duration-200 cursor-pointer hover:text-yellow-400`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-1">
                  Review
                </label>
                <textarea
                  id="review"
                  rows="4"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-highlight-500 focus:border-highlight-500"
                  placeholder="Share your thoughts about this product"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubmittingReview}
                className="w-full bg-highlight-500 hover:bg-highlight-600 text-white font-medium py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-highlight-500 transition-all duration-300"
              >
                {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          )}
          
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-4 hover:border-highlight-500 transition-colors duration-300">
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <FaStar 
                          key={i} 
                          className={`${
                            i < review.rating 
                              ? 'text-yellow-400' 
                              : 'text-gray-300'
                          } mr-1 text-sm`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-700 ml-2">
                      {review.user?.name || 'Anonymous'}
                    </span>
                  </div>
                  <p className="text-gray-600">{review.review_text}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 