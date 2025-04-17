const express = require('express');
const { resetDatabase } = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Reset database route - Admin only
router.delete('/reset', protect, authorize('admin'), resetDatabase);

module.exports = router; 