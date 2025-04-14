const express = require('express');
const { 
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateUserRole
} = require('../controllers/users');
const { getUserReviews } = require('../controllers/reviews');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// User management routes (admin only)
router.route('/')
  .get(protect, authorize('admin'), getUsers)
  .post(protect, authorize('admin'), createUser);

router.route('/:id')
  .get(protect, getUser)
  .put(protect, updateUser)
  .delete(protect, deleteUser);

// Update user role route (admin only)
router.put('/:id/role', protect, authorize('admin'), updateUserRole);

// Get reviews by a user
router.get('/:userId/reviews', protect, getUserReviews);

// Admin routes for user management would go here
// These would be protected by the admin authorization middleware

module.exports = router; 