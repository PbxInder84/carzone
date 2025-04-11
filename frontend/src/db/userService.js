import apiClient from '../utils/apiClient';

// Get all users
export const getAllUsers = async (page = 1, limit = 10, filters = {}) => {
  try {
    let url = `/api/users?page=${page}&limit=${limit}`;
    
    // Add filters if any
    if (filters.role) url += `&role=${filters.role}`;
    if (filters.search) url += `&search=${filters.search}`;
    if (filters.sortBy) url += `&sortBy=${filters.sortBy}`;
    
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get user by ID
export const getUserById = async (userId) => {
  try {
    const response = await apiClient.get(`/api/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create user (admin only)
export const createUser = async (userData) => {
  try {
    const response = await apiClient.post('/api/users', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update user
export const updateUser = async (userId, userData) => {
  try {
    const response = await apiClient.put(`/api/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete user
export const deleteUser = async (userId) => {
  try {
    const response = await apiClient.delete(`/api/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update user role
export const updateUserRole = async (userId, role) => {
  try {
    const response = await apiClient.put(`/api/users/${userId}/role`, { role });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Mock data for development
export const getMockUsers = (page = 1, limit = 10) => {
  const users = [
    { id: 1, name: 'John Admin', email: 'john@example.com', role: 'admin', createdAt: '2023-09-15' },
    { id: 2, name: 'Sarah Seller', email: 'sarah@example.com', role: 'seller', createdAt: '2023-09-18' },
    { id: 3, name: 'Mike User', email: 'mike@example.com', role: 'user', createdAt: '2023-09-20' },
    { id: 4, name: 'Emily User', email: 'emily@example.com', role: 'user', createdAt: '2023-09-22' },
    { id: 5, name: 'David User', email: 'david@example.com', role: 'user', createdAt: '2023-09-25' },
    { id: 6, name: 'Lisa User', email: 'lisa@example.com', role: 'user', createdAt: '2023-09-28' },
    { id: 7, name: 'Tom Seller', email: 'tom@example.com', role: 'seller', createdAt: '2023-10-01' },
    { id: 8, name: 'Anna User', email: 'anna@example.com', role: 'user', createdAt: '2023-10-03' },
    { id: 9, name: 'Robert User', email: 'robert@example.com', role: 'user', createdAt: '2023-10-05' },
    { id: 10, name: 'Jessica User', email: 'jessica@example.com', role: 'user', createdAt: '2023-10-08' },
    { id: 11, name: 'Alice Cooper', email: 'alice@example.com', role: 'user', createdAt: '2023-10-15' },
    { id: 12, name: 'Bob Dylan', email: 'bob@example.com', role: 'user', createdAt: '2023-10-14' },
    { id: 13, name: 'Charlie Parker', email: 'charlie@example.com', role: 'seller', createdAt: '2023-10-13' },
    { id: 14, name: 'David Bowie', email: 'david@example.com', role: 'user', createdAt: '2023-10-12' }
  ];
  
  const start = (page - 1) * limit;
  const end = start + limit;
  
  return {
    data: users.slice(start, end),
    pagination: {
      total: users.length,
      page,
      limit,
      pages: Math.ceil(users.length / limit)
    }
  };
}; 