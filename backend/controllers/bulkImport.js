const { Product, ProductCategory, User } = require('../models');
const ErrorResponse = require('../utils/errorResponse');
const { Op } = require('sequelize');

// @desc    Bulk import products
// @route   POST /api/bulk/products
// @access  Private (Admin only)
exports.bulkImportProducts = async (req, res, next) => {
  try {
    // Ensure products array is provided
    if (!req.body.products || !Array.isArray(req.body.products)) {
      return next(new ErrorResponse('Please provide an array of products', 400));
    }

    const products = req.body.products;
    const results = {
      totalItems: products.length,
      successful: 0,
      failed: 0,
      errors: []
    };

    // Process products sequentially
    for (const [index, productData] of products.entries()) {
      try {
        // Add seller to request body if not present
        if (!productData.seller_id) {
          productData.seller_id = req.user.id;
        }

        // Basic validation
        if (!productData.name || !productData.price || !productData.category_id) {
          results.errors.push({
            index,
            name: productData.name || `Item ${index}`,
            error: 'Missing required fields (name, price, category_id)'
          });
          results.failed++;
          continue;
        }

        // Create the product
        await Product.create(productData);
        results.successful++;
      } catch (error) {
        results.errors.push({
          index,
          name: productData.name || `Item ${index}`,
          error: error.message
        });
        results.failed++;
      }
    }

    res.status(201).json({
      success: true,
      data: results
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Bulk import categories
// @route   POST /api/bulk/categories
// @access  Private (Admin only)
exports.bulkImportCategories = async (req, res, next) => {
  try {
    // Ensure categories array is provided
    if (!req.body.categories || !Array.isArray(req.body.categories)) {
      return next(new ErrorResponse('Please provide an array of categories', 400));
    }

    const categories = req.body.categories;
    const results = {
      totalItems: categories.length,
      successful: 0,
      failed: 0,
      errors: []
    };

    // Process categories sequentially
    for (const [index, categoryData] of categories.entries()) {
      try {
        // Basic validation
        if (!categoryData.name) {
          results.errors.push({
            index,
            name: categoryData.name || `Item ${index}`,
            error: 'Missing required field (name)'
          });
          results.failed++;
          continue;
        }

        // Create the category
        await ProductCategory.create(categoryData);
        results.successful++;
      } catch (error) {
        results.errors.push({
          index,
          name: categoryData.name || `Item ${index}`,
          error: error.message
        });
        results.failed++;
      }
    }

    res.status(201).json({
      success: true,
      data: results
    });
  } catch (err) {
    next(err);
  }
}; 