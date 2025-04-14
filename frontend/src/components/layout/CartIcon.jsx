import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaShoppingCart } from 'react-icons/fa';
import { getCartItems } from '../../features/cart/cartSlice';

const CartIcon = () => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  
  useEffect(() => {
    if (user) {
      dispatch(getCartItems());
    }
  }, [dispatch, user]);
  
  const cartItemCount = cartItems.length;
  
  return (
    <Link 
      to="/cart"
      className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
      aria-label="Shopping cart"
    >
      <FaShoppingCart className="text-xl" />
      {cartItemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {cartItemCount > 9 ? '9+' : cartItemCount}
        </span>
      )}
    </Link>
  );
};

export default CartIcon; 