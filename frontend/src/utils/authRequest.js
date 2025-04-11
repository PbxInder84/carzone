import axios from 'axios';
import { store } from '../app/store';

/**
 * Creates an axios request config with authentication headers
 * @param {Object} options - Additional axios request options
 * @returns {Object} Axios request config with auth headers
 */
export const authRequest = (options = {}) => {
  const state = store.getState();
  const user = state.auth.user;
  
  // If user exists and has a token, add auth header
  if (user && user.token) {
    return {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${user.token}`,
      },
    };
  }
  
  return options;
};

/**
 * Creates an axios instance with authentication interceptor
 * This adds the auth token to every request made with this instance
 */
export const authAxios = axios.create();

// Add request interceptor to add auth header
authAxios.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const user = state.auth.user;
    
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

export default authAxios; 