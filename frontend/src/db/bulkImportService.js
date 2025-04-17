import axios from 'axios';
import apiClient from './apiClient';

const API_URL = '/api/bulk';

// Helper function to get authentication config
const getConfig = () => {
  const token = localStorage.getItem('user') 
    ? JSON.parse(localStorage.getItem('user')).token 
    : null;
  
  return {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    }
  };
};

// Bulk import products
export const bulkImportProducts = async (productsArray) => {
  try {
    const response = await axios.post(
      `${API_URL}/products`,
      { products: productsArray },
      getConfig()
    );
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.error || 'Something went wrong';
    throw new Error(message);
  }
};

// Bulk import categories
export const bulkImportCategories = async (categoriesArray) => {
  try {
    const response = await axios.post(
      `${API_URL}/categories`,
      { categories: categoriesArray },
      getConfig()
    );
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.error || 'Something went wrong';
    throw new Error(message);
  }
}; 