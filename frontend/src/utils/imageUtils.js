/**
 * Gets the complete URL for an image path from the backend
 * 
 * @param {string} imagePath - The relative path of the image (/uploads/products/filename.jpg)
 * @param {string} fallbackUrl - Optional fallback URL if imagePath is empty or invalid
 * @returns {string} Complete URL to the image
 */
export const getImageUrl = (imagePath, fallbackUrl = 'https://via.placeholder.com/300x200?text=No+Image') => {
  // If no image path, return fallback
  if (!imagePath) {
    return fallbackUrl;
  }

  // If image path is already a full URL (starts with http:// or https://)
  if (imagePath.match(/^https?:\/\//i)) {
    return imagePath;
  }

  // For development environment, we use the relative URL
  // which will be proxied by the setupProxy.js
  return imagePath; // e.g., '/uploads/products/filename.jpg'
};

/**
 * Checks if an image URL is valid/accessible
 * 
 * @param {string} url - The URL to check
 * @returns {Promise<boolean>} True if image is valid, false otherwise
 */
export const isImageValid = async (url) => {
  if (!url || url.includes('placeholder.com')) {
    return false;
  }
  
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};

export default {
  getImageUrl,
  isImageValid
}; 