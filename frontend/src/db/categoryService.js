import apiClient from './apiClient';

const API_URL = '/categories';

// Get all categories
export const getAllCategories = async () => {
  try {
    const response = await apiClient.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get category by ID
export const getCategoryById = async (categoryId) => {
  try {
    const response = await apiClient.get(`${API_URL}/${categoryId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create category
export const createCategory = async (categoryData) => {
  try {
    const response = await apiClient.post(API_URL, categoryData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update category
export const updateCategory = async (categoryId, categoryData) => {
  try {
    const response = await apiClient.put(`${API_URL}/${categoryId}`, categoryData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete category
export const deleteCategory = async (categoryId) => {
  try {
    const response = await apiClient.delete(`${API_URL}/${categoryId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Upload category image
export const uploadCategoryImage = async (id, formData) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  const response = await apiClient.post(`${API_URL}/${id}/upload`, formData, config);
  return response.data;
}; 