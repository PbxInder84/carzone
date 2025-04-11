import apiClient from '../utils/apiClient';

// Get all orders
export const getAllOrders = async (page = 1, limit = 10, filters = {}) => {
  try {
    let url = `/api/orders?page=${page}&limit=${limit}`;
    
    // Add filters if any
    if (filters.status) url += `&status=${filters.status}`;
    if (filters.search) url += `&search=${filters.search}`;
    if (filters.sortBy) url += `&sortBy=${filters.sortBy}`;
    
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get order by ID
export const getOrderById = async (orderId) => {
  try {
    const response = await apiClient.get(`/api/orders/${orderId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update order status
export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await apiClient.put(`/api/orders/${orderId}/status`, { status });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete order
export const deleteOrder = async (orderId) => {
  try {
    const response = await apiClient.delete(`/api/orders/${orderId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get orders dashboard stats
export const getOrderStats = async () => {
  try {
    const response = await apiClient.get('/api/orders/stats');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Mock data for development
export const getMockOrders = (page = 1, limit = 10) => {
  const orders = [
    { id: 'ORD-1234', customer: 'John Doe', date: '2023-10-15', status: 'completed', total: 2450 },
    { id: 'ORD-1233', customer: 'Jane Smith', date: '2023-10-14', status: 'processing', total: 1980 },
    { id: 'ORD-1232', customer: 'Robert Johnson', date: '2023-10-13', status: 'completed', total: 3240 },
    { id: 'ORD-1231', customer: 'Sarah Williams', date: '2023-10-12', status: 'canceled', total: 1550 },
    { id: 'ORD-1230', customer: 'Michael Brown', date: '2023-10-11', status: 'processing', total: 4200 },
    { id: 'ORD-1229', customer: 'Emily Davis', date: '2023-10-10', status: 'completed', total: 1850 },
    { id: 'ORD-1228', customer: 'David Wilson', date: '2023-10-09', status: 'processing', total: 2760 },
    { id: 'ORD-1227', customer: 'Lisa Anderson', date: '2023-10-08', status: 'canceled', total: 1290 },
    { id: 'ORD-1226', customer: 'Thomas Taylor', date: '2023-10-07', status: 'completed', total: 3100 },
    { id: 'ORD-1225', customer: 'Jennifer Martinez', date: '2023-10-06', status: 'processing', total: 2340 },
    { id: 'ORD-1224', customer: 'Jessica Johnson', date: '2023-10-05', status: 'completed', total: 1775 },
    { id: 'ORD-1223', customer: 'Andrew Smith', date: '2023-10-04', status: 'canceled', total: 2890 },
  ];
  
  const start = (page - 1) * limit;
  const end = start + limit;
  
  return {
    data: orders.slice(start, end),
    pagination: {
      total: orders.length,
      page,
      limit,
      pages: Math.ceil(orders.length / limit)
    }
  };
}; 