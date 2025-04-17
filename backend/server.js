const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');
const { connectDB } = require('./config/db');
const errorHandler = require('./middlewares/error');
const logger = require('./utils/logger');
const requestLogger = require('./middlewares/requestLogger');
const fs = require('fs');

// Load environment variables
dotenv.config();


// Route files
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const orderRoutes = require('./routes/orders');
const reviewRoutes = require('./routes/reviews');
const cartRoutes = require('./routes/cart');
const userRoutes = require('./routes/users');
const checkoutRoutes = require('./routes/checkout');
const settingsRoutes = require('./routes/settings');
const bulkRoutes = require('./routes/bulk');
const adminRoutes = require('./routes/admin');

// Connect to database
connectDB();

const app = express();

// Morgan logger with environment-specific format
if (process.env.NODE_ENV === 'production') {
  // Use a more concise format in production for better performance
  app.use(morgan('combined', { stream: logger.stream }));
} else {
  // Use a more detailed format in development
  app.use(morgan('dev', { stream: logger.stream }));
}

// Body parser
app.use(express.json());

// Detailed request logger (for development or when explicitly enabled)
app.use(requestLogger);

// Enable CORS
app.use(cors());

// Set security HTTP headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 10 minutes'
});
app.use(limiter);

// Setup folders for file uploads if they don't exist
const uploadsDir = path.join(__dirname, '../uploads');
const productsDir = path.join(uploadsDir, 'products');
const categoriesDir = path.join(uploadsDir, 'categories');

// Log upload directory paths
logger.info(`Uploads directory: ${uploadsDir}`);
logger.info(`Products uploads: ${productsDir}`);
logger.info(`Categories uploads: ${categoriesDir}`);

// Ensure upload directories exist
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  logger.info('Created uploads directory');
}
if (!fs.existsSync(productsDir)) {
  fs.mkdirSync(productsDir, { recursive: true });
  logger.info('Created products upload directory');
}
if (!fs.existsSync(categoriesDir)) {
  fs.mkdirSync(categoriesDir, { recursive: true });
  logger.info('Created categories upload directory');
}

// Set static folder - using absolute path
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/users', userRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/bulk', bulkRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: Date.now()
  });
});

// Use error handler middleware
app.use(errorHandler);

// Handle 404 routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`Server started successfully`, {
    environment: process.env.NODE_ENV,
    port: PORT,
    url: `http://localhost:${PORT}`,
    nodeVersion: process.version,
    platform: process.platform,
    memoryUsage: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB'
  });
}); 