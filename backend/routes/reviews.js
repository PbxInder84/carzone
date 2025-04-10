const express = require('express');
const {
  getUserReviews,
  updateReview,
  deleteReview
} = require('../controllers/reviews');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// Note: Product-specific review routes are in products.js
// User-specific review routes are in users.js

router.route('/:id')
  .put(protect, updateReview)
  .delete(protect, deleteReview);

module.exports = router; 