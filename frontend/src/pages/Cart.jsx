import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaMinus, FaPlus, FaTrash, FaShoppingCart, FaArrowLeft, FaShoppingBag } from 'react-icons/fa';
import { getCartItems, updateCartItem, removeFromCart, clearCart } from '../features/cart/cartSlice';
import Spinner from '../components/layout/Spinner';
import { getImageUrl } from '../utils/imageUtils';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, cartTotal, isLoading } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const [localLoading, setLocalLoading] = useState({});

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    dispatch(getCartItems());
  }, [user, dispatch, navigate]);

  const handleQuantityChange = async (id, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    
    if (newQuantity < 1) {
      return;
    }
    
    setLocalLoading(prev => ({ ...prev, [id]: true }));
    
    try {
      await dispatch(updateCartItem({ id, quantity: newQuantity })).unwrap();
    } catch (error) {
      toast.error(error || 'Failed to update quantity');
    } finally {
      setLocalLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleRemoveItem = async (id) => {
    if (window.confirm('Are you sure you want to remove this item from your cart?')) {
      setLocalLoading(prev => ({ ...prev, [id]: true }));
      
      try {
        await dispatch(removeFromCart(id)).unwrap();
        toast.success('Item removed from cart');
      } catch (error) {
        toast.error(error || 'Failed to remove item');
      } finally {
        setLocalLoading(prev => ({ ...prev, [id]: false }));
      }
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await dispatch(clearCart()).unwrap();
        toast.success('Cart cleared successfully');
      } catch (error) {
        toast.error(error || 'Failed to clear cart');
      }
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <FaShoppingCart className="mr-2" /> Shopping Cart
      </h1>
      
      {cartItems.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-gray-500 mb-4 flex flex-col items-center">
            <FaShoppingBag className="text-5xl mb-4 text-gray-300" />
            <p className="text-xl font-medium mb-2">Your cart is empty</p>
            <p className="mb-4">Looks like you haven't added anything to your cart yet.</p>
          </div>
          <Link to="/products" className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">
            <FaArrowLeft className="mr-2" /> Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items - Left */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Cart Items ({cartItems.length})</h2>
                  <button
                    onClick={handleClearCart}
                    className="text-sm text-red-600 hover:text-red-800 flex items-center"
                  >
                    <FaTrash className="mr-1" /> Clear Cart
                  </button>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-4 flex flex-col md:flex-row items-start md:items-center">
                    {/* Product Image */}
                    <div className="w-full md:w-24 flex-shrink-0 mb-4 md:mb-0">
                      <div className="h-24 w-24 mx-auto overflow-hidden rounded-md">
                        <img
                          src={getImageUrl(item.product.image_url)}
                          alt={item.product.name}
                          className="h-full w-full object-cover object-center"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                          }}
                        />
                      </div>
                    </div>
                    
                    {/* Product Info */}
                    <div className="flex-1 px-4">
                      <Link to={`/products/${item.product.id}`} className="text-lg font-medium text-gray-800 hover:text-primary-600">
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-gray-500 mb-2">
                        ${parseFloat(item.product.price).toFixed(2)} each
                      </p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center mt-2">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                          disabled={localLoading[item.id] || item.quantity <= 1}
                          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FaMinus className="text-xs" />
                        </button>
                        <span className="mx-3 w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                          disabled={localLoading[item.id]}
                          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FaPlus className="text-xs" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Price and Remove */}
                    <div className="mt-4 md:mt-0 w-full md:w-auto flex flex-row md:flex-col items-center justify-between md:justify-end">
                      <div className="text-lg font-semibold text-gray-800">
                        ${(item.quantity * parseFloat(item.product.price)).toFixed(2)}
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={localLoading[item.id]}
                        className="text-sm text-red-600 hover:text-red-800 mt-1 flex items-center"
                      >
                        <FaTrash className="mr-1" /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-6">
              <Link to="/products" className="inline-flex items-center text-primary-600 hover:text-primary-800">
                <FaArrowLeft className="mr-2" /> Continue Shopping
              </Link>
            </div>
          </div>
          
          {/* Order Summary - Right */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>Calculated at checkout</span>
                </div>
                
                <div className="my-4 border-t border-gray-200 pt-4">
                  <div className="flex justify-between font-semibold">
                    <span>Estimated Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                </div>
                
                <button
                  onClick={handleCheckout}
                  className="w-full py-3 px-4 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
                  disabled={cartItems.length === 0}
                >
                  Proceed to Checkout
                </button>
                
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Secure checkout - No payment information required
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart; 