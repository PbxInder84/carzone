const { Cart, Product, Order, OrderItem, User } = require('../models');
const { sequelize } = require('../config/db');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Process checkout with multiple payment methods
// @route   POST /api/checkout
// @access  Private
exports.processCheckout = async (req, res, next) => {
  const { shipping_address, payment_method, payment_details } = req.body;

  // Validation is now handled by middleware
  
  // Start a transaction
  const t = await sequelize.transaction();

  try {
    // Get cart items for the user
    const cartItems = await Cart.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: Product,
          as: 'product',
          attributes: [
            'id', 
            'name', 
            'price', 
            'image_url', 
            'stock_quantity',
            'seller_id'
          ],
          include: [
            {
              model: User,
              as: 'seller',
              attributes: ['id', 'name']
            }
          ]
        }
      ],
      transaction: t
    });

    // Check if cart is empty
    if (!cartItems || cartItems.length === 0) {
      await t.rollback();
      return next(new ErrorResponse('Your cart is empty', 400));
    }

    // Validate all items have sufficient stock
    for (const item of cartItems) {
      if (item.quantity > item.product.stock_quantity) {
        await t.rollback();
        return next(new ErrorResponse(`Insufficient stock for ${item.product.name}`, 400));
      }
    }

    // Calculate total amount
    const totalAmount = cartItems.reduce((total, item) => {
      return total + (item.quantity * item.product.price);
    }, 0);

    // Set payment status based on payment method
    let paymentStatus = 'pending';
    if (payment_method === 'cod') {
      paymentStatus = 'pending'; // COD is paid on delivery
    } else if (payment_method === 'upi' || payment_method === 'net_banking') {
      // For demo purposes, we'll mark these as completed
      // In a real app, you'd check for actual payment confirmation
      paymentStatus = 'completed';
    }

    // Create order
    const order = await Order.create(
      {
        user_id: req.user.id,
        shipping_address,
        total_amount: totalAmount,
        payment_method: payment_method || 'cod', // Default to COD if not specified
        payment_details: payment_details || null,
        payment_status: paymentStatus,
        payment_date: paymentStatus === 'completed' ? new Date() : null,
        order_status: 'processing'
      },
      { transaction: t }
    );

    // Create order items and update product stock
    const orderItemsPromises = cartItems.map(async (item) => {
      // Update product stock
      await Product.update(
        { stock_quantity: item.product.stock_quantity - item.quantity },
        { 
          where: { id: item.product_id },
          transaction: t 
        }
      );

      // Create order item
      return OrderItem.create(
        {
          order_id: order.id,
          product_id: item.product_id,
          seller_id: item.product.seller_id,
          quantity: item.quantity,
          price_at_time_of_order: item.product.price
        },
        { transaction: t }
      );
    });

    // Execute all promises
    await Promise.all(orderItemsPromises);

    // Clear the cart
    await Cart.destroy({
      where: { user_id: req.user.id },
      transaction: t
    });

    // Commit the transaction
    await t.commit();

    // Get the complete order with all relations
    const completedOrder = await Order.findByPk(order.id, {
      include: [
        {
          model: OrderItem,
          as: 'orderItems',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'price', 'image_url']
            },
            {
              model: User,
              as: 'seller',
              attributes: ['id', 'name', 'email']
            }
          ]
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: completedOrder
    });
  } catch (err) {
    // Rollback transaction on error
    await t.rollback();
    next(err);
  }
};

// @desc    Get order confirmation details
// @route   GET /api/checkout/confirmation/:orderId
// @access  Private
exports.getOrderConfirmation = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.orderId, {
      include: [
        {
          model: OrderItem,
          as: 'orderItems',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'price', 'image_url']
            },
            {
              model: User,
              as: 'seller',
              attributes: ['id', 'name', 'email']
            }
          ]
        }
      ]
    });

    if (!order) {
      return next(new ErrorResponse(`Order not found with id of ${req.params.orderId}`, 404));
    }

    // Make sure the user is owner of the order
    if (order.user_id.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to view this order', 403));
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update payment for an order (for UPI and Net Banking)
// @route   PUT /api/checkout/:orderId/update-payment
// @access  Private
exports.updatePayment = async (req, res, next) => {
  const { payment_details } = req.body;
  
  try {
    const order = await Order.findByPk(req.params.orderId);
    
    if (!order) {
      return next(new ErrorResponse(`Order not found with id of ${req.params.orderId}`, 404));
    }
    
    // Verify user owns this order
    if (order.user_id.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to update payment for this order', 403));
    }
    
    // Update payment details
    await order.update({
      payment_details,
      payment_status: 'completed',
      payment_date: new Date()
    });
    
    res.status(200).json({
      success: true,
      message: 'Payment updated successfully',
      data: order
    });
  } catch (err) {
    next(err);
  }
}; 