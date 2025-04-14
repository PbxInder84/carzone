const express = require('express');
const {
  processCheckout,
  getOrderConfirmation,
  updatePayment
} = require('../controllers/checkout');
const { protect } = require('../middlewares/auth');
const { validate, checkoutSchema, paymentUpdateSchema } = require('../middlewares/validator');

const router = express.Router();

// Protect all routes
router.use(protect);

// Checkout routes
router.post('/', validate(checkoutSchema), processCheckout);
router.get('/confirmation/:orderId', getOrderConfirmation);
router.put('/:orderId/update-payment', validate(paymentUpdateSchema), updatePayment);

module.exports = router; 