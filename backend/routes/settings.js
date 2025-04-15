const express = require('express');
const { 
  getSettings, 
  getSetting, 
  updateSettings, 
  updateSetting, 
  deleteSetting,
  initializeSettings
} = require('../controllers/siteSettings');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Public routes
router.get('/', getSettings);
router.get('/:key', getSetting);

// Admin only routes
router.put('/', protect, authorize('admin'), updateSettings);
router.put('/:key', protect, authorize('admin'), updateSetting);
router.delete('/:key', protect, authorize('admin'), deleteSetting);

// Allow initialization without auth during initial setup
// In production, this should be protected or disabled after setup
router.post('/init', initializeSettings);

module.exports = router; 