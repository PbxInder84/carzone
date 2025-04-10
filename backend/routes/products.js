const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/products');
const { getProductReviews, createReview } = require('../controllers/reviews');
const { protect, authorize } = require('../middlewares/auth');
const { validate, productSchema } = require('../middlewares/validator');

const router = express.Router();

// Product routes
router.route('/')
  .get(getProducts)
  .post(protect, authorize('seller', 'admin'), validate(productSchema), createProduct);

router.route('/:id')
  .get(getProduct)
  .put(protect, authorize('seller', 'admin'), updateProduct)
  .delete(protect, authorize('seller', 'admin'), deleteProduct);

// Review routes for products
router.route('/:productId/reviews')
  .get(getProductReviews)
  .post(protect, createReview);

module.exports = router; 