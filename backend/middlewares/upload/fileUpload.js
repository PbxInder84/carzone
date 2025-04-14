const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ErrorResponse = require('../../utils/errorResponse');

// Ensure upload directories exist
const productsDir = path.join(__dirname, '../../../uploads/products');
const categoriesDir = path.join(__dirname, '../../../uploads/categories');

// Create directories if they don't exist
if (!fs.existsSync(productsDir)) {
  fs.mkdirSync(productsDir, { recursive: true });
}

if (!fs.existsSync(categoriesDir)) {
  fs.mkdirSync(categoriesDir, { recursive: true });
}

// Set storage engine for products
const productStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, productsDir);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `product_${Date.now()}${path.extname(file.originalname)}`
    );
  }
});

// Set storage engine for categories
const categoryStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, categoriesDir);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `category_${Date.now()}${path.extname(file.originalname)}`
    );
  }
});

// Check file type
const fileFilter = (req, file, cb) => {
  // Allowed extensions
  const filetypes = /jpeg|jpg|png|gif/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new ErrorResponse('Only image files are allowed', 400));
  }
};

// Initialize uploads
const productUpload = multer({
  storage: productStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: fileFilter
});

const categoryUpload = multer({
  storage: categoryStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: fileFilter
});

// Export multer middleware
module.exports = {
  uploadProductImage: productUpload.single('product_image'),
  uploadCategoryImage: categoryUpload.single('category_image')
}; 