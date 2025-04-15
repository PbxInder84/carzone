import axios from 'axios';

// Simple request cache to prevent duplicate requests
const requestCache = {};
const CACHE_TIMEOUT = 5000; // 5 seconds

// Get the API base URL from the environment or use relative path
const baseURL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

console.log('API Client initialized with baseURL:', baseURL);

// Create axios instance
const apiClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method.toUpperCase()} request to: ${config.url}`, config.data || config.params);
    
    // Check if this is a GET request that could be cached
    if (config.method === 'get') {
      const cacheKey = `${config.url}${JSON.stringify(config.params || {})}`;
      
      // Check if we have a cached response that's not expired
      if (requestCache[cacheKey] && 
          requestCache[cacheKey].timestamp > Date.now() - CACHE_TIMEOUT) {
        // Return cached promise to avoid duplicate requests
        const cachedResponse = requestCache[cacheKey].response;
        console.log(`Using cached response for ${config.url}`);
        
        // Return a Promise rejected with a special flag to indicate it was handled by cache
        return Promise.reject({
          config,
          cachedResponse,
          isFromCache: true
        });
      }
    }
    
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        // The auth controller sends the token directly in the response
        if (user && user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common response issues and cache responses
apiClient.interceptors.response.use(
  (response) => {
    console.log(`Received response from ${response.config.url}:`, response.status);
    
    // Cache successful GET responses
    if (response.config.method === 'get') {
      const cacheKey = `${response.config.url}${JSON.stringify(response.config.params || {})}`;
      requestCache[cacheKey] = {
        timestamp: Date.now(),
        response: response
      };
    }
    return response;
  },
  (error) => {
    // Check if this is a rejection due to cache hit
    if (error.isFromCache) {
      return error.cachedResponse;
    }
    
    // Log the error
    console.error('API request error:', error.response?.status, error.message);
    
    // Handle unauthorized errors (401)
    if (error.response && error.response.status === 401) {
      // Clear local storage and redirect to login if token expired
      if (localStorage.getItem('user')) {
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    
    // Handle rate limiting (429)
    if (error.response && error.response.status === 429) {
      console.warn('Rate limit exceeded. Request will be retried after a delay.');
      // Return a promise that will resolve after a delay
      return new Promise(resolve => {
        setTimeout(() => {
          // Make a new request after the delay
          resolve(apiClient(error.config));
        }, 2000); // Wait 2 seconds before retrying
      });
    }
    
    return Promise.reject(error);
  }
);

export default apiClient; 