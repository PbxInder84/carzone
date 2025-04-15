/**
 * Middleware to handle async route functions and catch errors
 * @param {Function} fn The async route handler
 * @returns {Function} Express middleware function
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler; 