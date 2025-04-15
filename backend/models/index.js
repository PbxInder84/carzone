const User = require('./User');
const Product = require('./Product');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Review = require('./Review');
const Cart = require('./Cart');
const ProductCategory = require('./ProductCategory');
const Coupon = require('./Coupon');
const OrderCoupon = require('./OrderCoupon');
const SiteSettings = require('./SiteSettings');

// User Associations
User.hasMany(Product, { foreignKey: 'seller_id', as: 'products' });
User.hasMany(Order, { foreignKey: 'user_id', as: 'orders' });
User.hasMany(Review, { foreignKey: 'user_id', as: 'reviews' });
User.hasMany(Cart, { foreignKey: 'user_id', as: 'cartItems' });

// Product Associations
Product.belongsTo(User, { foreignKey: 'seller_id', as: 'seller' });
Product.belongsTo(ProductCategory, { foreignKey: 'category_id', as: 'productCategory' });
Product.hasMany(Review, { foreignKey: 'product_id', as: 'reviews' });
Product.hasMany(OrderItem, { foreignKey: 'product_id', as: 'orderItems' });
Product.hasMany(Cart, { foreignKey: 'product_id', as: 'inCarts' });

// Order Associations
Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'orderItems' });
Order.hasMany(OrderCoupon, { foreignKey: 'order_id', as: 'appliedCoupons' });

// OrderItem Associations
OrderItem.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
OrderItem.belongsTo(User, { foreignKey: 'seller_id', as: 'seller' });

// Review Associations
Review.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Review.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// Cart Associations
Cart.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Cart.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// ProductCategory Associations
ProductCategory.hasMany(Product, { foreignKey: 'category_id', as: 'products' });

// Coupon Associations
Coupon.hasMany(OrderCoupon, { foreignKey: 'coupon_id', as: 'orders' });

// OrderCoupon Associations
OrderCoupon.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });
OrderCoupon.belongsTo(Coupon, { foreignKey: 'coupon_id', as: 'coupon' });

module.exports = {
  User,
  Product,
  Order,
  OrderItem,
  Review,
  Cart,
  ProductCategory,
  Coupon,
  OrderCoupon,
  SiteSettings
}; 