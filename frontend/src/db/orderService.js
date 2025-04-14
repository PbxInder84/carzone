import apiClient from './apiClient';

const API_URL = '/orders';

// Get all orders (admin)
const getOrders = async () => {
  const response = await apiClient.get(API_URL);
  return response.data;
};

// Get all orders with pagination and filters
const getAllOrders = async (page = 1, pageSize = 10, filters = {}) => {
  const { search, status, sortBy } = filters;
  
  let queryParams = new URLSearchParams();
  queryParams.append('page', page);
  queryParams.append('limit', pageSize);
  
  if (search) queryParams.append('search', search);
  if (status) queryParams.append('status', status);
  if (sortBy) queryParams.append('sortBy', sortBy);
  
  const response = await apiClient.get(`${API_URL}?${queryParams.toString()}`);
  return response.data;
};

// Get user orders
const getUserOrders = async () => {
  const response = await apiClient.get(`${API_URL}/my-orders`);
  return response.data;
};

// Get order by ID
const getOrderById = async (id) => {
  const response = await apiClient.get(`${API_URL}/${id}`);
  return response.data;
};

// Create order
const createOrder = async (orderData) => {
  const response = await apiClient.post(API_URL, orderData);
  return response.data;
};

// Update order status
const updateOrderStatus = async (id, status) => {
  try {
    console.log(`Updating order ${id} to status: ${status}`);
    
    // First check the API path
    const response = await apiClient.patch(`${API_URL}/${id}`, { 
      order_status: status 
    });
    
    console.log('Update order status response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in updateOrderStatus:', error.response || error);
    throw error;
  }
};

// Create payment intent
const createPaymentIntent = async (orderId) => {
  const response = await apiClient.post(`${API_URL}/${orderId}/payment-intent`);
  return response.data;
};

// Confirm payment
const confirmPayment = async (orderId, paymentData) => {
  const response = await apiClient.post(`${API_URL}/${orderId}/confirm-payment`, paymentData);
  return response.data;
};

// Export all functions individually as named exports
export {
  getOrders,
  getAllOrders,
  getUserOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  createPaymentIntent,
  confirmPayment
};

// Also export default for compatibility with existing code
const orderService = {
  getOrders,
  getAllOrders,
  getUserOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  createPaymentIntent,
  confirmPayment,
};

export default orderService; 