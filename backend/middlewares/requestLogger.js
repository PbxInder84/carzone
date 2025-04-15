const logger = require('../utils/logger');

/**
 * Middleware to log detailed request information
 */
const requestLogger = (req, res, next) => {
  // Only log in development, or when explicitly enabled
  if (process.env.NODE_ENV !== 'development' && !process.env.ENABLE_REQUEST_LOGGING) {
    return next();
  }

  const start = new Date();

  // Log the request
  logger.debug(`REQUEST: ${req.method} ${req.originalUrl}`, {
    body: JSON.stringify(req.body),
    params: req.params,
    query: req.query,
    headers: {
      'user-agent': req.headers['user-agent'],
      'content-type': req.headers['content-type'],
      'content-length': req.headers['content-length'],
      authorization: req.headers.authorization 
        ? (req.headers.authorization.startsWith('Bearer') 
          ? 'Bearer [TOKEN]' 
          : 'PRESENT') 
        : 'NONE'
    },
    ip: req.ip
  });

  // Create response interceptor to log response
  const originalSend = res.send;
  res.send = function(body) {
    const responseTime = new Date() - start;
    
    logger.debug(`RESPONSE: ${req.method} ${req.originalUrl} ${res.statusCode} (${responseTime}ms)`, {
      responseSize: body ? body.length : 0,
      responseStatus: res.statusCode
    });
    
    originalSend.call(this, body);
  };

  next();
};

module.exports = requestLogger; 