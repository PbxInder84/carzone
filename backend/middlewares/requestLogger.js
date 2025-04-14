const logger = require('../utils/logger');

/**
 * Middleware to log detailed request information
 * Useful for debugging but can be disabled in production for performance
 */
const requestLogger = (req, res, next) => {
  // Only log detailed requests in development mode or if explicitly enabled
  if (process.env.NODE_ENV !== 'development' && process.env.DETAILED_LOGGING !== 'true') {
    return next();
  }

  // Create a sanitized copy of headers (remove sensitive data)
  const sanitizedHeaders = { ...req.headers };
  
  // Remove sensitive authentication information if present
  if (sanitizedHeaders.authorization) {
    sanitizedHeaders.authorization = 'REDACTED';
  }
  if (sanitizedHeaders.cookie) {
    sanitizedHeaders.cookie = 'REDACTED';
  }
  
  // Log request details
  logger.debug('Request details', {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    headers: sanitizedHeaders,
    query: req.query,
    // Don't log body in production to avoid logging sensitive data
    body: process.env.NODE_ENV === 'development' ? req.body : 'REDACTED'
  });
  
  next();
};

module.exports = requestLogger; 