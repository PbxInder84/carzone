const express = require('express');
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryProducts
} = require('../controllers/categories');
const { protect, authorize } = require('../middlewares/auth');
const { uploadCategoryImage } = require('../middlewares/upload/fileUpload');

const router = express.Router();

// Category routes
router.route('/')
  .get(getCategories)
  .post(protect, authorize('seller', 'admin'), uploadCategoryImage, createCategory);

router.route('/:id')
  .get(getCategory)
  .put(protect, authorize('seller', 'admin'), uploadCategoryImage, updateCategory)
  .delete(protect, authorize('seller', 'admin'), deleteCategory);

// Get products by category
router.route('/:id/products')
  .get(getCategoryProducts);

module.exports = router; 