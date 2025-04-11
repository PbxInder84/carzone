import axios from 'axios';

// Helper function to get the base URL based on the environment
const getBaseUrl = () => {
  // If in development, we'll rely on the proxy in package.json
  if (process.env.NODE_ENV === 'development') {
    return '';
  }
  // For production, use the environment variable if available
  return process.env.REACT_APP_API_URL || '';
};

// Create axios instance with baseURL
const apiClient = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    
    // Log request details in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`, config);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for common error handling
apiClient.interceptors.response.use(
  (response) => {
    // Log response in development
    if (process.env.NODE_ENV === 'development') {
      console.log('API Response:', response);
    }
    return response;
  },
  (error) => {
    // Log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', error.response || error);
    }
    
    // Handle common errors (401, 403, etc.)
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        // Unauthorized - clear user data and redirect to login
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient; 