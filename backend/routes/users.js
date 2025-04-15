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
const { OrderItem, Order, Product, Review } = require('../models');
const { Op } = require('sequelize');
const ErrorResponse = require('../utils/errorResponse');

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

// Get purchased products by a user
router.get('/:userId/purchased-products', protect, async (req, res, next) => {
  try {
    // Check if the requesting user is authorized
    if (req.user.id.toString() !== req.params.userId.toString() && req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to view these products', 403));
    }

    // Find all products that the user has purchased
    const purchasedProducts = await OrderItem.findAll({
      include: [
        {
          model: Order,
          as: 'order',
          where: { 
            user_id: req.params.userId,
            order_status: { [Op.ne]: 'cancelled' } // Exclude cancelled orders
          },
          attributes: ['id', 'order_status', 'created_at']
        },
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'price', 'image_url', 'description']
        }
      ],
      attributes: ['id', 'quantity', 'price_at_time_of_order'],
      order: [['created_at', 'DESC']]
    });

    // Format the data and check if user has already reviewed each product
    const formattedProducts = await Promise.all(
      purchasedProducts.map(async (item) => {
        // Check if user has already reviewed this product
        const existingReview = await Review.findOne({
          where: {
            product_id: item.product.id,
            user_id: req.params.userId
          },
          attributes: ['id', 'rating', 'created_at']
        });

        return {
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          image_url: item.product.image_url,
          description: item.product.description,
          order_id: item.order.id,
          purchase_date: item.order.created_at,
          quantity_purchased: item.quantity,
          price_paid: item.price_at_time_of_order,
          has_reviewed: !!existingReview,
          user_rating: existingReview ? existingReview.rating : null,
          review_id: existingReview ? existingReview.id : null
        };
      })
    );

    // Remove duplicates (user might have purchased same product multiple times)
    const uniqueProducts = formattedProducts.filter(
      (product, index, self) => 
        index === self.findIndex((p) => p.id === product.id)
    );

    res.status(200).json({
      success: true,
      count: uniqueProducts.length,
      data: uniqueProducts
    });
  } catch (err) {
    next(err);
  }
});

// Admin routes for user management would go here
// These would be protected by the admin authorization middleware

module.exports = router; 