import axios from 'axios';
const API_URL = 'http://localhost:5000/api';

// Get product reviews
const getProductReviews = async (productId) => {
  const response = await axios.get(`${API_URL}/products/${productId}/reviews`);
  return response.data;
};

// Get user's reviewed products
const getUserReviews = async (userId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(`${API_URL}/users/${userId}/reviews`, config);
  return response.data;
};

// Create new review
const createReview = async (productId, reviewData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(`${API_URL}/products/${productId}/reviews`, reviewData, config);
  return response.data;
};

// Update review
const updateReview = async (reviewId, reviewData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(`${API_URL}/reviews/${reviewId}`, reviewData, config);
  return response.data;
};

// Delete review
const deleteReview = async (reviewId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(`${API_URL}/reviews/${reviewId}`, config);
  return response.data;
};

// Check if user has purchased product
const checkCanReview = async (productId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    await axios.get(`${API_URL}/products/${productId}/can-review`, config);
    return { canReview: true };
  } catch (error) {
    if (error.response && error.response.status === 403) {
      return { canReview: false, message: error.response.data.error };
    }
    throw error;
  }
};

const reviewService = {
  getProductReviews,
  getUserReviews,
  createReview,
  updateReview,
  deleteReview,
  checkCanReview,
};

export default reviewService; 