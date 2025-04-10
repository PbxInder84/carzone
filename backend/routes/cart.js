const express = require('express');
const {
  getCartItems,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart
} = require('../controllers/cart');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.route('/')
  .get(protect, getCartItems)
  .post(protect, addCartItem)
  .delete(protect, clearCart);

router.route('/:id')
  .put(protect, updateCartItem)
  .delete(protect, removeCartItem);

module.exports = router; 