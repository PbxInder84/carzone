const Joi = require('joi');
const ErrorResponse = require('../utils/errorResponse');

// User validation schemas
const registerSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('admin', 'seller', 'user').default('user')
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Product validation schemas
const productSchema = Joi.object({
  name: Joi.string().min(3).max(255).required(),
  description: Joi.string().allow('', null),
  price: Joi.number().positive().required(),
  category: Joi.string().required(),
  category_id: Joi.number().allow(null),
  stock_quantity: Joi.number().integer().min(0).default(0),
  image_url: Joi.string().allow('', null)
});

// Order validation schemas
const orderSchema = Joi.object({
  total_amount: Joi.number().positive().required(),
  shipping_address: Joi.string().required(),
  payment_status: Joi.string().valid('pending', 'completed', 'failed').default('pending'),
  order_status: Joi.string().valid('pending', 'processing', 'shipped', 'delivered', 'cancelled').default('pending'),
  items: Joi.array().items(
    Joi.object({
      product_id: Joi.number().required(),
      quantity: Joi.number().integer().min(1).required(),
      price_at_time_of_order: Joi.number().positive().required(),
      seller_id: Joi.number().required()
    })
  ).min(1).required(),
  coupon_code: Joi.string().allow('', null)
});

// Middleware function to validate request body
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const message = error.details.map(detail => detail.message).join(', ');
      return next(new ErrorResponse(message, 400));
    }
    next();
  };
};

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  productSchema,
  orderSchema
}; 