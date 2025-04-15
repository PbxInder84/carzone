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
const { uploadProductImage } = require('../middlewares/upload/fileUpload');
const { Product, OrderItem, Order, Review } = require('../models');
const { Op } = require('sequelize');
const { ErrorResponse } = require('../utils/errorResponse');

const router = express.Router();

// Product routes
router.route('/')
  .get(getProducts)
  .post(protect, authorize('seller', 'admin'), uploadProductImage, createProduct);

router.route('/:id')
  .get(getProduct)
  .put(protect, authorize('seller', 'admin'), uploadProductImage, updateProduct)
  .delete(protect, authorize('seller', 'admin'), deleteProduct);

// Review routes for products
router.route('/:productId/reviews')
  .get(getProductReviews)
  .post(protect, createReview);

// Check if user can review product
router.get('/:productId/can-review', protect, async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const userId = req.user.id;
    
    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return next(new ErrorResponse(`Product not found with id of ${productId}`, 404));
    }

    // Check if user has purchased the product
    const hasPurchased = await OrderItem.findOne({
      where: { 
        product_id: productId 
      },
      include: [
        {
          model: Order,
          as: 'order',
          where: { 
            user_id: userId,
            order_status: { [Op.ne]: 'cancelled' } // Exclude cancelled orders
          }
        }
      ]
    });

    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({
      where: {
        product_id: productId,
        user_id: userId
      }
    });

    if (!hasPurchased && req.user.role !== 'admin') {
      return next(new ErrorResponse('You can only review products you have purchased', 403));
    }

    if (existingReview) {
      return next(new ErrorResponse('You have already reviewed this product', 400));
    }

    res.status(200).json({
      success: true,
      data: { canReview: true }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router; 