const { Order, OrderItem, Product, User, Coupon, OrderCoupon } = require('../models');
const ErrorResponse = require('../utils/errorResponse');
const { sequelize } = require('../config/db');
const { Op } = require('sequelize');

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
exports.getOrders = async (req, res, next) => {
  try {
    let orders;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    // Different queries based on user role
    if (req.user.role === 'admin') {
      // Admin can see all orders
      orders = await Order.findAndCountAll({
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email']
          },
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
        ],
        limit,
        offset,
        order: [['created_at', 'DESC']]
      });
    } else if (req.user.role === 'seller') {
      // Sellers can only see orders that contain their products
      orders = await Order.findAndCountAll({
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email']
          },
          {
            model: OrderItem,
            as: 'orderItems',
            required: true, // INNER JOIN
            where: { seller_id: req.user.id },
            include: [
              {
                model: Product,
                as: 'product',
                attributes: ['id', 'name', 'price', 'image_url']
              }
            ]
          }
        ],
        limit,
        offset,
        order: [['created_at', 'DESC']]
      });
    } else {
      // Regular users can only see their own orders
      orders = await Order.findAndCountAll({
        where: { user_id: req.user.id },
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
        ],
        limit,
        offset,
        order: [['created_at', 'DESC']]
      });
    }

    // Calculate pagination values
    const totalPages = Math.ceil(orders.count / limit);

    res.status(200).json({
      success: true,
      count: orders.count,
      pagination: {
        current_page: page,
        total_pages: totalPages,
        per_page: limit
      },
      data: orders.rows
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        },
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
        },
        {
          model: OrderCoupon,
          as: 'appliedCoupons',
          include: [
            {
              model: Coupon,
              as: 'coupon',
              attributes: ['id', 'code', 'discount_percentage', 'discount_amount']
            }
          ]
        }
      ]
    });

    if (!order) {
      return next(new ErrorResponse(`Order not found with id of ${req.params.id}`, 404));
    }

    // Make sure the user is owner of the order, a seller with products in the order, or an admin
    if (
      req.user.role !== 'admin' && 
      order.user_id.toString() !== req.user.id.toString() && 
      req.user.role === 'seller' && 
      !order.orderItems.some(item => item.seller_id.toString() === req.user.id.toString())
    ) {
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

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  const { items, shipping_address, total_amount, coupon_code } = req.body;

  // Validate if items array is provided
  if (!items || items.length === 0) {
    return next(new ErrorResponse('Please add at least one item to your order', 400));
  }

  // Start a transaction
  const t = await sequelize.transaction();

  try {
    // First, create the order
    const order = await Order.create(
      {
        user_id: req.user.id,
        shipping_address,
        total_amount
      },
      { transaction: t }
    );

    // Create order items and update product stock
    const orderItemsPromises = items.map(async (item) => {
      // Find the product to ensure it exists and check stock
      const product = await Product.findByPk(item.product_id, { transaction: t });
      
      if (!product) {
        throw new ErrorResponse(`Product not found with id of ${item.product_id}`, 404);
      }

      if (product.stock_quantity < item.quantity) {
        throw new ErrorResponse(`Insufficient stock for product ${product.name}`, 400);
      }

      // Update product stock
      await Product.update(
        { stock_quantity: product.stock_quantity - item.quantity },
        { where: { id: item.product_id }, transaction: t }
      );

      // Create order item
      return await OrderItem.create(
        {
          order_id: order.id,
          product_id: item.product_id,
          seller_id: product.seller_id,
          quantity: item.quantity,
          price_at_time_of_order: product.price
        },
        { transaction: t }
      );
    });

    // Execute all promises
    await Promise.all(orderItemsPromises);

    // Apply coupon if provided
    if (coupon_code) {
      const coupon = await Coupon.findOne({
        where: { 
          code: coupon_code,
          is_active: true,
          [Op.or]: [
            { end_date: null },
            { end_date: { [Op.gte]: new Date() } }
          ]
        },
        transaction: t
      });

      if (!coupon) {
        throw new ErrorResponse('Invalid or expired coupon code', 400);
      }

      let discountAmount = 0;
      
      if (coupon.discount_amount) {
        discountAmount = coupon.discount_amount;
      } else if (coupon.discount_percentage) {
        discountAmount = (total_amount * coupon.discount_percentage) / 100;
      }

      // Apply minimum purchase check
      if (total_amount < coupon.minimum_purchase) {
        throw new ErrorResponse(`Order does not meet minimum purchase requirement of ${coupon.minimum_purchase}`, 400);
      }

      // Create order coupon record
      await OrderCoupon.create(
        {
          order_id: order.id,
          coupon_id: coupon.id,
          discount_applied: discountAmount
        },
        { transaction: t }
      );

      // Update order total
      const newTotal = Math.max(0, total_amount - discountAmount);
      await Order.update(
        { total_amount: newTotal },
        { where: { id: order.id }, transaction: t }
      );
    }

    // Commit the transaction
    await t.commit();

    // Get the complete order with items
    const fullOrder = await Order.findByPk(order.id, {
      include: [
        {
          model: OrderItem,
          as: 'orderItems',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'price', 'image_url']
            }
          ]
        }
      ]
    });

    res.status(201).json({
      success: true,
      data: fullOrder
    });
  } catch (err) {
    // Rollback transaction on error
    await t.rollback();
    next(err);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private (Admin or Seller)
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { order_status } = req.body;

    if (!order_status) {
      return next(new ErrorResponse('Please provide an order status', 400));
    }

    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: OrderItem,
          as: 'orderItems'
        }
      ]
    });

    if (!order) {
      return next(new ErrorResponse(`Order not found with id of ${req.params.id}`, 404));
    }

    // Check authorization
    if (req.user.role === 'user') {
      return next(new ErrorResponse('Not authorized to update order status', 403));
    }

    // If seller, can only update if they have products in the order
    if (
      req.user.role === 'seller' && 
      !order.orderItems.some(item => item.seller_id.toString() === req.user.id.toString())
    ) {
      return next(new ErrorResponse('Not authorized to update this order', 403));
    }

    // Update order status
    await Order.update(
      { order_status },
      { where: { id: req.params.id } }
    );

    // Get updated order
    const updatedOrder = await Order.findByPk(req.params.id);

    res.status(200).json({
      success: true,
      data: updatedOrder
    });
  } catch (err) {
    next(err);
  }
}; 