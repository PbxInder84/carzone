const express = require('express');
const {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus
} = require('../controllers/orders');
const { protect, authorize } = require('../middlewares/auth');
const { validate, orderSchema } = require('../middlewares/validator');

const router = express.Router();

router.route('/')
  .get(protect, getOrders)
  .post(protect, validate(orderSchema), createOrder);

router.route('/:id')
  .get(protect, getOrder)
  .put(protect, authorize('seller', 'admin'), updateOrderStatus);

module.exports = router; 