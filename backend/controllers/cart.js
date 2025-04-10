const { Cart, Product, User } = require('../models');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get cart items for a user
// @route   GET /api/cart
// @access  Private
exports.getCartItems = async (req, res, next) => {
  try {
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
      ]
    });

    // Calculate cart totals
    const cartTotal = cartItems.reduce((total, item) => {
      return total + (item.quantity * item.product.price);
    }, 0);

    res.status(200).json({
      success: true,
      count: cartItems.length,
      total: cartTotal,
      data: cartItems
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
exports.addCartItem = async (req, res, next) => {
  try {
    const { product_id, quantity = 1 } = req.body;

    // Check if product exists and has sufficient stock
    const product = await Product.findByPk(product_id);
    
    if (!product) {
      return next(new ErrorResponse(`Product not found with id of ${product_id}`, 404));
    }

    if (product.stock_quantity < quantity) {
      return next(new ErrorResponse(`Insufficient stock for product: ${product.name}`, 400));
    }

    // Check if item already exists in cart
    let cartItem = await Cart.findOne({
      where: {
        user_id: req.user.id,
        product_id
      }
    });

    if (cartItem) {
      // Update quantity if already exists
      const newQuantity = cartItem.quantity + parseInt(quantity);
      
      // Check if new quantity exceeds stock
      if (newQuantity > product.stock_quantity) {
        return next(new ErrorResponse(`Cannot add more. Insufficient stock for product: ${product.name}`, 400));
      }
      
      cartItem = await Cart.update(
        { quantity: newQuantity },
        { 
          where: { id: cartItem.id },
          returning: true
        }
      );

      // Get updated cart item
      const updatedCartItem = await Cart.findByPk(cartItem[0], {
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'price', 'image_url']
          }
        ]
      });

      return res.status(200).json({
        success: true,
        data: updatedCartItem
      });
    }

    // Create new cart item
    cartItem = await Cart.create({
      user_id: req.user.id,
      product_id,
      quantity: parseInt(quantity)
    });

    // Get cart item with product details
    const newCartItem = await Cart.findByPk(cartItem.id, {
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'price', 'image_url']
        }
      ]
    });

    res.status(201).json({
      success: true,
      data: newCartItem
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:id
// @access  Private
exports.updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    
    if (!quantity || quantity < 1) {
      return next(new ErrorResponse('Please provide a valid quantity', 400));
    }

    // Find cart item
    let cartItem = await Cart.findByPk(req.params.id, {
      include: [
        {
          model: Product,
          as: 'product'
        }
      ]
    });

    if (!cartItem) {
      return next(new ErrorResponse(`Cart item not found with id of ${req.params.id}`, 404));
    }

    // Make sure cart item belongs to user
    if (cartItem.user_id.toString() !== req.user.id.toString()) {
      return next(new ErrorResponse('Not authorized to update this cart item', 403));
    }

    // Check stock availability
    if (quantity > cartItem.product.stock_quantity) {
      return next(new ErrorResponse(`Insufficient stock for product: ${cartItem.product.name}`, 400));
    }

    // Update cart item quantity
    await Cart.update(
      { quantity },
      { where: { id: req.params.id } }
    );

    // Get updated cart item
    const updatedCartItem = await Cart.findByPk(req.params.id, {
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'price', 'image_url']
        }
      ]
    });

    res.status(200).json({
      success: true,
      data: updatedCartItem
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:id
// @access  Private
exports.removeCartItem = async (req, res, next) => {
  try {
    const cartItem = await Cart.findByPk(req.params.id);

    if (!cartItem) {
      return next(new ErrorResponse(`Cart item not found with id of ${req.params.id}`, 404));
    }

    // Make sure cart item belongs to user
    if (cartItem.user_id.toString() !== req.user.id.toString()) {
      return next(new ErrorResponse('Not authorized to remove this cart item', 403));
    }

    await cartItem.destroy();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Clear user's cart
// @route   DELETE /api/cart
// @access  Private
exports.clearCart = async (req, res, next) => {
  try {
    await Cart.destroy({
      where: { user_id: req.user.id }
    });

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
}; 