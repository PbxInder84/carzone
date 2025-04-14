import apiClient from './apiClient';

// Process checkout with payment methods
export const processCheckout = async (checkoutData) => {
  try {
    const response = await apiClient.post('/checkout', checkoutData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// Get order confirmation details
export const getOrderConfirmation = async (orderId) => {
  try {
    console.log('Fetching order confirmation for order ID:', orderId);
    const response = await apiClient.get(`/checkout/confirmation/${orderId}`);
    console.log('Order confirmation response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching order confirmation:', error);
    throw error.response ? error.response.data : error;
  }
};

// Update payment details for an order
export const updatePayment = async (orderId, paymentDetails) => {
  try {
    const response = await apiClient.put(`/checkout/${orderId}/update-payment`, { payment_details: paymentDetails });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
}; 