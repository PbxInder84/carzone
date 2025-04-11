import axios from 'axios';

const API_URL = '/api/categories';

// Get all categories
export const getAllCategories = async () => {
  const response = await axios.get(API_URL);
  return response;
};

// Get a category by ID
export const getCategoryById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response;
};

// Create a new category
export const createCategory = async (categoryData) => {
  const response = await axios.post(API_URL, categoryData);
  return response;
};

// Update a category
export const updateCategory = async (id, categoryData) => {
  const response = await axios.put(`${API_URL}/${id}`, categoryData);
  return response;
};

// Delete a category
export const deleteCategory = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response;
};

// Upload category image
export const uploadCategoryImage = async (id, formData) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  const response = await axios.post(`${API_URL}/${id}/upload`, formData, config);
  return response;
};

// Mock data for development
export const getMockCategories = () => {
  return {
    data: [
      { 
        id: 'interior', 
        name: 'Interior Accessories', 
        description: 'Enhance your car\'s interior with premium accessories.',
        icon: 'FaCar',
        image: '/images/placeholder.jpg'
      },
      { 
        id: 'exterior', 
        name: 'Exterior Accessories', 
        description: 'Make your car stand out with our exterior upgrades.',
        icon: 'FaWrench',
        image: '/images/placeholder.jpg'
      },
      { 
        id: 'electronics', 
        name: 'Electronics', 
        description: 'Smart electronic solutions for a modern driving experience.',
        icon: 'FaLightbulb',
        image: '/images/placeholder.jpg'
      },
      { 
        id: 'tools', 
        name: 'Tools & Equipment', 
        description: 'Quality tools for maintenance and repairs.',
        icon: 'FaTools',
        image: '/images/placeholder.jpg'
      }
    ]
  };
}; 