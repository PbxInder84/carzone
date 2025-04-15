import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaStar } from 'react-icons/fa';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const ReviewForm = ({ productId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user, token } = useSelector((state) => state.auth);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };
      
      const data = {
        rating,
        review_text: reviewText
      };
      
      await axios.post(`${API_URL}/products/${productId}/reviews`, data, config);
      
      toast.success('Review submitted successfully');
      setRating(0);
      setReviewText('');
      
      // Notify parent component to refresh reviews
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to submit review';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!user) {
    return (
      <div className="bg-gray-100 p-4 rounded-lg text-center mb-6">
        <p className="text-gray-600">Please sign in to leave a review</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Rating
          </label>
          <div className="flex">
            {[...Array(5)].map((_, index) => {
              const ratingValue = index + 1;
              
              return (
                <button
                  type="button"
                  key={index}
                  className={`bg-transparent border-none outline-none cursor-pointer p-0 mr-2 text-2xl ${
                    (hover || rating) >= ratingValue ? "text-yellow-400" : "text-gray-300"
                  }`}
                  onClick={() => setRating(ratingValue)}
                  onMouseEnter={() => setHover(ratingValue)}
                  onMouseLeave={() => setHover(0)}
                  aria-label={`Rate ${ratingValue} out of 5 stars`}
                >
                  <FaStar />
                </button>
              );
            })}
            <span className="ml-2 text-gray-600 text-sm">
              {rating > 0 ? `Your rating: ${rating}/5` : "Select rating"}
            </span>
          </div>
        </div>
        
        <div className="mb-4">
          <label 
            htmlFor="reviewText"
            className="block text-gray-700 text-sm font-medium mb-2"
          >
            Your Review
          </label>
          <textarea
            id="reviewText"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            rows="4"
            placeholder="Share your experience with this product..."
          ></textarea>
        </div>
        
        <button
          type="submit"
          className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm; 