import apiClient from './apiClient';

// Mock data for development when API is not available
const mockUsers = [
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
];

// Get all users
export const getAllUsers = async (page = 1, limit = 10, filters = {}) => {
  try {
    let url = `/users?page=${page}&limit=${limit}`;
    
    // Add filters if any
    if (filters.role) url += `&role=${filters.role}`;
    if (filters.search) url += `&search=${filters.search}`;
    if (filters.sortBy) url += `&sortBy=${filters.sortBy}`;
    
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    
    // For development - return mock data if API is not available
    if (error.response && error.response.status === 404 && process.env.NODE_ENV === 'development') {
      console.info('Using mock user data for development');
      
      const filteredUsers = mockUsers.filter(user => {
        // Apply role filter
        if (filters.role && user.role !== filters.role) return false;
        
        // Apply search filter
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          return user.name.toLowerCase().includes(searchLower) || 
                 user.email.toLowerCase().includes(searchLower);
        }
        
        return true;
      });
      
      const start = (page - 1) * limit;
      const end = start + limit;
      
      return {
        success: true,
        count: filteredUsers.length,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(filteredUsers.length / limit),
          per_page: parseInt(limit)
        },
        data: filteredUsers.slice(start, end)
      };
    }
    
    throw error;
  }
};

// Get user by ID
export const getUserById = async (userId) => {
  try {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    // For development - return mock data if API is not available
    if (error.response && error.response.status === 404 && process.env.NODE_ENV === 'development') {
      const user = mockUsers.find(u => u.id.toString() === userId.toString());
      if (user) {
        return { success: true, data: user };
      }
    }
    throw error;
  }
};

// Create user
export const createUser = async (userData) => {
  try {
    const response = await apiClient.post('/users', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update user
export const updateUser = async (userId, userData) => {
  try {
    const response = await apiClient.put(`/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    // For development - mock successful update if API is not available
    if (error.response && error.response.status === 404 && process.env.NODE_ENV === 'development') {
      const userIndex = mockUsers.findIndex(u => u.id.toString() === userId.toString());
      if (userIndex !== -1) {
        const updatedUser = { ...mockUsers[userIndex], ...userData };
        mockUsers[userIndex] = updatedUser;
        return { success: true, data: updatedUser };
      }
    }
    throw error;
  }
};

// Delete user
export const deleteUser = async (userId) => {
  try {
    const response = await apiClient.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    // For development - mock successful delete if API is not available
    if (error.response && error.response.status === 404 && process.env.NODE_ENV === 'development') {
      const userIndex = mockUsers.findIndex(u => u.id.toString() === userId.toString());
      if (userIndex !== -1) {
        mockUsers.splice(userIndex, 1);
        return { success: true, data: {} };
      }
    }
    throw error;
  }
};

// Update user role
export const updateUserRole = async (userId, role) => {
  try {
    const response = await apiClient.put(`/users/${userId}/role`, { role });
    return response.data;
  } catch (error) {
    // For development - mock successful role update if API is not available
    if (error.response && error.response.status === 404 && process.env.NODE_ENV === 'development') {
      const userIndex = mockUsers.findIndex(u => u.id.toString() === userId.toString());
      if (userIndex !== -1) {
        mockUsers[userIndex].role = role;
        return { success: true, data: mockUsers[userIndex] };
      }
    }
    throw error;
  }
};

// Change user password
export const changePassword = async (userId, currentPassword, newPassword) => {
  try {
    const response = await apiClient.put(`/users/${userId}/password`, {
      currentPassword,
      newPassword
    });
    return response.data;
  } catch (error) {
    // For development - mock successful password change if API is not available
    if (error.response && error.response.status === 404 && process.env.NODE_ENV === 'development') {
      const userIndex = mockUsers.findIndex(u => u.id.toString() === userId.toString());
      if (userIndex !== -1) {
        // In a real application, we'd validate the current password before allowing the change
        // Here we're just mocking a successful response
        return { success: true, message: 'Password changed successfully' };
      }
    }
    throw error;
  }
}; 