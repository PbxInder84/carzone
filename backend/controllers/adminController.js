const { 
  Product, 
  ProductCategory, 
  User, 
  Order, 
  OrderItem, 
  Review,
  Cart,
  Coupon,
  OrderCoupon,
  SiteSettings
} = require('../models');
const logger = require('../utils/logger');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Reset database - deletes all products, categories, orders, and cart items
// @route   DELETE /api/admin/reset
// @access  Private (Admin only)
exports.resetDatabase = async (req, res, next) => {
  try {
    // Get confirmation from request body
    const { confirm } = req.body;
    
    if (!confirm || confirm !== 'CONFIRM_RESET') {
      return next(new ErrorResponse('Please provide confirmation text "CONFIRM_RESET" to proceed with database reset', 400));
    }
    
    logger.info(`Database reset initiated by admin: ${req.user.email}`);
    
    // Delete all records from different tables
    // Using transaction would be better but keeping it simple for now
    try {
      await Review.destroy({ where: {} });
      logger.info('Reviews deleted');
    } catch (err) {
      logger.warn('Error deleting reviews:', err.message);
    }
    
    try {
      await OrderItem.destroy({ where: {} });
      logger.info('Order items deleted');
    } catch (err) {
      logger.warn('Error deleting order items:', err.message);
    }
    
    try {
      await OrderCoupon.destroy({ where: {} });
      logger.info('Order coupons deleted');
    } catch (err) {
      logger.warn('Error deleting order coupons:', err.message);
    }
    
    try {
      await Order.destroy({ where: {} });
      logger.info('Orders deleted');
    } catch (err) {
      logger.warn('Error deleting orders:', err.message);
    }
    
    try {
      await Cart.destroy({ where: {} });
      logger.info('Cart items deleted');
    } catch (err) {
      logger.warn('Error deleting cart items:', err.message);
    }
    
    try {
      await Product.destroy({ where: {} });
      logger.info('Products deleted');
    } catch (err) {
      logger.warn('Error deleting products:', err.message);
    }
    
    try {
      await ProductCategory.destroy({ where: {} });
      logger.info('Categories deleted');
    } catch (err) {
      logger.warn('Error deleting categories:', err.message);
    }
    
    try {
      await Coupon.destroy({ where: {} });
      logger.info('Coupons deleted');
    } catch (err) {
      logger.warn('Error deleting coupons:', err.message);
    }
    
    // Don't delete users - this would log everyone out including the admin
    // If you want to delete non-admin users:
    // await User.destroy({ where: { role: { [Op.ne]: 'admin' } } });
    
    logger.info('Database reset completed successfully');
    
    res.status(200).json({
      success: true,
      message: 'Database has been reset successfully'
    });
  } catch (error) {
    logger.error(`Error resetting database: ${error.message}`, { error });
    next(error);
  }
}; 