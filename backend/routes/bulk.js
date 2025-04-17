const express = require('express');
const {
  bulkImportProducts,
  bulkImportCategories
} = require('../controllers/bulkImport');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Bulk import routes - Admin only
router.route('/products')
  .post(protect, authorize('admin'), bulkImportProducts);

router.route('/categories')
  .post(protect, authorize('admin'), bulkImportCategories);

module.exports = router; 