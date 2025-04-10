const express = require('express');
const { getUserReviews } = require('../controllers/reviews');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Get reviews by a user
router.get('/:userId/reviews', protect, getUserReviews);

// Admin routes for user management would go here
// These would be protected by the admin authorization middleware

module.exports = router; 