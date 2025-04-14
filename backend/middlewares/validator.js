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
  name: Joi.string().max(255).required(),
  description: Joi.string().allow('', null),
  price: Joi.number().precision(2).positive().required(),
  category: Joi.string().max(100).required(),
  stock_quantity: Joi.number().integer().min(0).default(0),
  image_url: Joi.string().max(255).allow('', null),
  category_id: Joi.number().allow(null),
  seller_id: Joi.number().required()
}).options({ stripUnknown: true });

// Category validation schema
const categorySchema = Joi.object({
  name: Joi.string().max(100).required(),
  description: Joi.string().allow('', null),
  image_url: Joi.string().max(255).allow('', null),
  icon: Joi.string().max(100).allow('', null)
}).options({ stripUnknown: true });

// Order validation schemas
const orderSchema = Joi.object({
  total_amount: Joi.number().precision(2).positive().required(),
  shipping_address: Joi.string().required(),
  payment_status: Joi.string().valid('pending', 'completed', 'failed').default('pending'),
  payment_method: Joi.string().valid('cod', 'upi', 'net_banking').default('cod'),
  payment_details: Joi.string().allow('', null),
  order_status: Joi.string().valid('pending', 'processing', 'shipped', 'delivered', 'cancelled').default('pending'),
  items: Joi.array().items(
    Joi.object({
      product_id: Joi.number().required(),
      quantity: Joi.number().integer().min(1).required(),
      price_at_time_of_order: Joi.number().precision(2).positive().required(),
      seller_id: Joi.number().required()
    })
  ).min(1).required()
}).options({ stripUnknown: true });

// Checkout validation schema
const checkoutSchema = Joi.object({
  shipping_address: Joi.string().required().min(10).max(255)
    .messages({
      'string.empty': 'Shipping address is required',
      'string.min': 'Shipping address must be at least {#limit} characters long',
      'string.max': 'Shipping address cannot exceed {#limit} characters',
      'any.required': 'Shipping address is required'
    }),
  payment_method: Joi.string().valid('cod', 'upi', 'net_banking').default('cod')
    .messages({
      'string.base': 'Payment method must be a string',
      'any.only': 'Payment method must be one of: COD, UPI, or Net Banking'
    }),
  payment_details: Joi.string().allow('', null)
    .when('payment_method', {
      is: Joi.string().valid('upi', 'net_banking'),
      then: Joi.string().required().messages({
        'any.required': 'Payment details are required for UPI or Net Banking'
      })
    })
}).options({ stripUnknown: true });

// Payment update validation schema
const paymentUpdateSchema = Joi.object({
  payment_details: Joi.string().required()
    .messages({
      'string.empty': 'Payment details are required',
      'any.required': 'Payment details are required'
    })
}).options({ stripUnknown: true });

// Middleware function to validate request body
const validate = (schema) => {
  return (req, res, next) => {
    // Skip validation if the request body is empty
    // This helps with multipart/form-data requests processed by multer
    if (!req.body || Object.keys(req.body).length === 0) {
      return next();
    }
    
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
  orderSchema,
  categorySchema,
  checkoutSchema,
  paymentUpdateSchema
}; 