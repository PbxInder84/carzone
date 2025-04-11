import apiClient from '../utils/apiClient';

// Get all products
export const getAllProducts = async (page = 1, limit = 10, filters = {}) => {
  try {
    let url = `/api/products?page=${page}&limit=${limit}`;
    
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
    const response = await apiClient.get(`/api/products/${productId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create product
export const createProduct = async (productData) => {
  try {
    const response = await apiClient.post('/api/products', productData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update product
export const updateProduct = async (productId, productData) => {
  try {
    const response = await apiClient.put(`/api/products/${productId}`, productData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete product
export const deleteProduct = async (productId) => {
  try {
    const response = await apiClient.delete(`/api/products/${productId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Upload product image
export const uploadProductImage = async (productId, imageFile) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await apiClient.post(`/api/products/${productId}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get product categories
export const getProductCategories = async () => {
  try {
    const response = await apiClient.get('/api/products/categories');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Mock data for development
export const getMockProducts = (page = 1, limit = 10) => {
  const products = [
    { id: 1, name: 'Tesla Model S', price: 89990, category: 'Electric', stock: 15, status: 'active' },
    { id: 2, name: 'BMW X5', price: 62500, category: 'SUV', stock: 8, status: 'active' },
    { id: 3, name: 'Toyota Camry', price: 25500, category: 'Sedan', stock: 25, status: 'active' },
    { id: 4, name: 'Honda Civic', price: 22000, category: 'Sedan', stock: 18, status: 'active' },
    { id: 5, name: 'Ford F-150', price: 32000, category: 'Truck', stock: 12, status: 'active' },
    { id: 6, name: 'Mercedes-Benz E-Class', price: 54950, category: 'Luxury', stock: 7, status: 'active' },
    { id: 7, name: 'Audi A4', price: 39900, category: 'Luxury', stock: 9, status: 'active' },
    { id: 8, name: 'Chevrolet Silverado', price: 33000, category: 'Truck', stock: 14, status: 'active' },
    { id: 9, name: 'Jeep Wrangler', price: 28900, category: 'SUV', stock: 6, status: 'active' },
    { id: 10, name: 'Nissan Altima', price: 24550, category: 'Sedan', stock: 22, status: 'active' },
    { id: 11, name: 'Lexus RX', price: 45950, category: 'Luxury SUV', stock: 11, status: 'active' },
    { id: 12, name: 'Subaru Outback', price: 26950, category: 'Crossover', stock: 17, status: 'active' },
  ];
  
  const start = (page - 1) * limit;
  const end = start + limit;
  
  return {
    data: products.slice(start, end),
    pagination: {
      total: products.length,
      page,
      limit,
      pages: Math.ceil(products.length / limit)
    }
  };
}; 