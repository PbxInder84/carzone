import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaMinus, FaPlus, FaTrash, FaShoppingCart, FaArrowLeft, FaShoppingBag, FaTruck, FaLock, FaTags } from 'react-icons/fa';
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary-800 text-white mb-8">
        {/* Background effects */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-primary-700"></div>
        </div>
        <div className="absolute -right-20 top-10 w-64 h-64 bg-secondary-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -left-20 bottom-10 w-64 h-64 bg-primary-400/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 py-10 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 leading-tight flex items-center justify-center">
              <FaShoppingCart className="mr-3" />
              Your Shopping Cart
            </h1>
            <p className="text-lg text-gray-100">
              {cartItems.length > 0 
                ? `You have ${cartItems.length} item${cartItems.length > 1 ? 's' : ''} in your cart` 
                : 'Your cart is currently empty'}
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4">
        {cartItems.length === 0 ? (
          <div className="backdrop-blur-sm bg-white/80 rounded-2xl shadow-xl border border-gray-100 p-8 text-center max-w-lg mx-auto">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 flex items-center justify-center bg-gray-100 rounded-full mb-6">
                <FaShoppingBag className="text-4xl text-gray-300" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Your cart is empty</h2>
              <p className="text-gray-600 mb-8">
                Looks like you haven't added anything to your cart yet.
                Browse our products and find something you'll love!
              </p>
              <Link 
                to="/products" 
                className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white font-medium rounded-full shadow-lg hover:bg-primary-700 hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1"
              >
                <FaShoppingBag className="mr-2" /> Start Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items - Left */}
            <div className="lg:col-span-2">
              <div className="backdrop-blur-sm bg-white/80 rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <div className="inline-block px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
                      {cartItems.length} ITEM{cartItems.length > 1 ? 'S' : ''} IN CART
                    </div>
                    <button
                      onClick={handleClearCart}
                      className="text-sm text-red-600 hover:text-red-800 flex items-center px-3 py-1 border border-red-100 rounded-full hover:bg-red-50 transition-colors"
                    >
                      <FaTrash className="mr-1" /> Clear Cart
                    </button>
                  </div>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {cartItems.map((item) => (
                    <div 
                      key={item.id} 
                      className="p-6 flex flex-col md:flex-row space-y-4 md:space-y-0 transform transition-all duration-300 hover:bg-white/70"
                    >
                      {/* Product Image */}
                      <div className="w-full md:w-28 flex-shrink-0">
                        <div className="h-28 w-28 mx-auto overflow-hidden rounded-xl border border-gray-100 shadow-sm">
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
                      <div className="flex-1 px-6">
                        <Link to={`/products/${item.product.id}`} className="text-lg font-bold text-gray-800 hover:text-primary-600 transition-colors">
                          {item.product.name}
                        </Link>
                        
                        {item.product.discount_percent > 0 ? (
                          <div className="flex flex-col mt-1">
                            <span className="text-primary-600 font-medium">
                              ${((1 - item.product.discount_percent / 100) * parseFloat(item.product.price)).toFixed(2)} each
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              ${parseFloat(item.product.price).toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          <div className="text-gray-600 mt-1">
                            ${parseFloat(item.product.price).toFixed(2)} each
                          </div>
                        )}
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center mt-4">
                          <div className="border border-gray-300 rounded-full flex overflow-hidden">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                              disabled={localLoading[item.id] || item.quantity <= 1}
                              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed border-r border-gray-300 transition-colors"
                            >
                              <FaMinus className="text-xs" />
                            </button>
                            <div className="w-12 flex items-center justify-center font-medium">
                              {localLoading[item.id] ? (
                                <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                item.quantity
                              )}
                            </div>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                              disabled={localLoading[item.id]}
                              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed border-l border-gray-300 transition-colors"
                            >
                              <FaPlus className="text-xs" />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Price and Remove */}
                      <div className="md:w-28 flex flex-row md:flex-col items-center justify-between md:justify-center md:items-end">
                        <div className="text-xl font-bold text-gray-800">
                          ${(item.quantity * (item.product.discount_percent > 0 
                            ? (1 - item.product.discount_percent / 100) * parseFloat(item.product.price) 
                            : parseFloat(item.product.price))).toFixed(2)}
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={localLoading[item.id]}
                          className="text-sm text-red-600 hover:text-red-800 mt-2 flex items-center hover:underline"
                        >
                          <FaTrash className="mr-1 text-xs" /> Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-6">
                <Link 
                  to="/products" 
                  className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full text-primary-600 hover:bg-primary-50 hover:text-primary-700 transition-colors shadow-sm"
                >
                  <FaArrowLeft className="mr-2" /> Continue Shopping
                </Link>
              </div>
            </div>
            
            {/* Order Summary - Right */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="backdrop-blur-sm bg-white/80 rounded-2xl shadow-xl border border-gray-100 p-6 mb-6">
                  <h2 className="text-xl font-bold mb-6 text-gray-800">Order Summary</h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal ({cartItems.length} item{cartItems.length > 1 ? 's' : ''})</span>
                      <span className="font-medium">${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span>Calculated at checkout</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Tax</span>
                      <span>Calculated at checkout</span>
                    </div>
                    
                    <div className="my-4 border-t border-gray-200 pt-4">
                      <div className="flex justify-between text-lg font-bold text-gray-800">
                        <span>Estimated Total</span>
                        <span>${cartTotal.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleCheckout}
                      className="w-full py-3 px-4 bg-primary-600 text-white font-medium rounded-full shadow-md hover:bg-primary-700 hover:shadow-lg transform transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
                      disabled={cartItems.length === 0}
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
                
                {/* Additional info cards */}
                <div className="space-y-4">
                  <div className="backdrop-blur-sm bg-white/80 rounded-xl shadow-lg border border-gray-100 p-4">
                    <div className="flex items-start">
                      <div className="bg-primary-100 p-2.5 rounded-full text-primary-600 mr-4">
                        <FaLock />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800 mb-1">Secure Checkout</h3>
                        <p className="text-sm text-gray-600">Your payment information is secure and encrypted</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="backdrop-blur-sm bg-white/80 rounded-xl shadow-lg border border-gray-100 p-4">
                    <div className="flex items-start">
                      <div className="bg-primary-100 p-2.5 rounded-full text-primary-600 mr-4">
                        <FaTruck />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800 mb-1">Fast Shipping</h3>
                        <p className="text-sm text-gray-600">Free shipping on orders over $50</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="backdrop-blur-sm bg-white/80 rounded-xl shadow-lg border border-gray-100 p-4">
                    <div className="flex items-start">
                      <div className="bg-primary-100 p-2.5 rounded-full text-primary-600 mr-4">
                        <FaTags />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800 mb-1">Special Offer</h3>
                        <p className="text-sm text-gray-600">Use code <span className="font-medium">FIRST10</span> for 10% off your first order</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart; 