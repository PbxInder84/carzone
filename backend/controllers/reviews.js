const { Review, Product, User, Order, OrderItem } = require('../models');
const ErrorResponse = require('../utils/errorResponse');
const { Op } = require('sequelize');

// @desc    Get reviews for a product
// @route   GET /api/products/:productId/reviews
// @access  Public
exports.getProductReviews = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const reviews = await Review.findAndCountAll({
      where: { product_id: req.params.productId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name']
        }
      ],
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });

    // Calculate pagination values
    const totalPages = Math.ceil(reviews.count / limit);

    res.status(200).json({
      success: true,
      count: reviews.count,
      pagination: {
        current_page: page,
        total_pages: totalPages,
        per_page: limit
      },
      data: reviews.rows
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get reviews made by a user
// @route   GET /api/users/:userId/reviews
// @access  Private
exports.getUserReviews = async (req, res, next) => {
  try {
    // Check if the requesting user is authorized
    if (req.user.id.toString() !== req.params.userId.toString() && req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to view these reviews', 403));
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const reviews = await Review.findAndCountAll({
      where: { user_id: req.params.userId },
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'image_url']
        }
      ],
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });

    // Calculate pagination values
    const totalPages = Math.ceil(reviews.count / limit);

    res.status(200).json({
      success: true,
      count: reviews.count,
      pagination: {
        current_page: page,
        total_pages: totalPages,
        per_page: limit
      },
      data: reviews.rows
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create review for a product
// @route   POST /api/products/:productId/reviews
// @access  Private
exports.createReview = async (req, res, next) => {
  try {
    const { rating, review_text } = req.body;
    const productId = req.params.productId;
    const userId = req.user.id;

    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return next(new ErrorResponse(`Product not found with id of ${productId}`, 404));
    }

    // Check if user has purchased the product before allowing a review
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

    if (!hasPurchased && req.user.role !== 'admin') {
      return next(new ErrorResponse('You can only review products you have purchased', 403));
    }

    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({
      where: {
        product_id: productId,
        user_id: userId
      }
    });

    if (existingReview) {
      return next(new ErrorResponse('You have already reviewed this product', 400));
    }

    // Create new review
    const review = await Review.create({
      product_id: productId,
      user_id: userId,
      rating,
      review_text
    });

    res.status(201).json({
      success: true,
      data: review
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = async (req, res, next) => {
  try {
    let review = await Review.findByPk(req.params.id);

    if (!review) {
      return next(new ErrorResponse(`Review not found with id of ${req.params.id}`, 404));
    }

    // Make sure review belongs to user or user is admin
    if (review.user_id.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to update this review', 403));
    }

    // Update review
    review = await Review.update(req.body, {
      where: { id: req.params.id },
      returning: true
    });

    // Get updated review
    const updatedReview = await Review.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name']
        },
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name']
        }
      ]
    });

    res.status(200).json({
      success: true,
      data: updatedReview
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByPk(req.params.id);

    if (!review) {
      return next(new ErrorResponse(`Review not found with id of ${req.params.id}`, 404));
    }

    // Make sure review belongs to user or user is admin
    if (review.user_id.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to delete this review', 403));
    }

    await review.destroy();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
}; 