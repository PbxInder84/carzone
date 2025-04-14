import apiClient from './apiClient';
import axios from 'axios';

// Get all categories
export const getAllCategories = async () => {
  try {
    const response = await apiClient.get('/categories');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get all products
export const getAllProducts = async (page = 1, limit = 10, filters = {}) => {
  try {
    let url = `/products?page=${page}&limit=${limit}`;
    
    // Add filters if any
    if (filters.category) url += `&category=${filters.category}`;
    if (filters.price) url += `&price=${filters.price}`;
    if (filters.search) url += `&search=${filters.search}`;
    if (filters.sortBy) url += `&sortBy=${filters.sortBy}`;
    
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get product by ID
export const getProductById = async (productId) => {
  try {
    const response = await apiClient.get(`/products/${productId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create product
export const createProduct = async (formData) => {
  try {
    const token = localStorage.getItem('token');
    
    // Log the form data contents for debugging
    console.log('FormData being sent:');
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value} (type: ${typeof value}, instanceof Array: ${Array.isArray(value)})`);
    }
    
    const response = await axios.post('/api/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    if (error.response && error.response.data) {
      console.error('Server response:', error.response.data);
    }
    throw error;
  }
};

// Update product
export const updateProduct = async (id, formData) => {
  try {
    const token = localStorage.getItem('token');
    
    // Log the form data contents for debugging
    console.log('FormData being sent for update:');
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    
    const response = await axios.put(`/api/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    if (error.response && error.response.data) {
      console.error('Server response:', error.response.data);
    }
    throw error;
  }
};

// Delete product
export const deleteProduct = async (productId) => {
  try {
    const response = await apiClient.delete(`/products/${productId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Upload product image
export const uploadProductImage = async (productId, formData) => {
  try {
    // Make sure formData contains the product_image field
    // The key 'product_image' should match what the backend expects
    console.log('Uploading image for product ID:', productId);
    
    const response = await apiClient.post(`/products/${productId}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error in uploadProductImage:', error);
    throw error;
  }
};

// Get product categories
export const getProductCategories = async () => {
  try {
    const response = await apiClient.get('/categories');
    return response.data;
  } catch (error) {
    throw error;
  }
}; 