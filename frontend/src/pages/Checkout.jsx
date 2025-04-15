import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { submitCheckout, resetCheckout } from '../features/checkout/checkoutSlice';
import { clearCart } from '../features/cart/cartSlice';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaSpinner, FaMoneyBillWave, FaMobile, FaUniversity } from 'react-icons/fa';

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { cartItems, cartTotal, isLoading: cartLoading } = useSelector((state) => state.cart);
  const { currentOrder, isLoading, success, error } = useSelector((state) => state.checkout);
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    // Redirect to cart if no items
    if (cartItems.length === 0 && !orderPlaced) {
      toast.info('Your cart is empty');
      navigate('/cart');
    }
    
    // Redirect to confirmation when order is successful
    if (success && currentOrder && !orderPlaced) {
      setOrderPlaced(true);
      navigate(`/order-confirmation/${currentOrder.id}`);
    }
    
    return () => {
      // Reset checkout state when component unmounts
      if (orderPlaced) {
        dispatch(resetCheckout());
        dispatch(clearCart());
      }
    };
  }, [cartItems, success, currentOrder, navigate, dispatch, orderPlaced]);
  
  // Form validation schema
  const validationSchema = Yup.object({
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    postalCode: Yup.string().required('Postal code is required'),
    country: Yup.string().required('Country is required'),
    paymentMethod: Yup.string().required('Payment method is required'),
    paymentDetails: Yup.string().when('paymentMethod', {
      is: (val) => val === 'upi' || val === 'net_banking',
      then: Yup.string().required('Payment details are required for the selected payment method')
    })
  });
  
  // Initial form values
  const initialValues = {
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    paymentMethod: 'cod',
    paymentDetails: ''
  };
  
  // Handle form submission
  const handleSubmit = (values) => {
    // Format shipping address
    const shippingAddress = `${values.address}, ${values.city}, ${values.state} ${values.postalCode}, ${values.country}`;
    
    // Dispatch checkout action with payment info
    dispatch(submitCheckout({
      shipping_address: shippingAddress,
      payment_method: values.paymentMethod,
      payment_details: values.paymentDetails
    }));
  };
  
  if (cartLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order Summary */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          
          {cartItems.length > 0 ? (
            <>
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center border-b pb-2">
                    <div className="flex items-center">
                      <img 
                        src={item.product.image_url} 
                        alt={item.product.name} 
                        className="w-16 h-16 object-cover rounded mr-4"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/placeholder-image.jpg';
                        }}
                      />
                      <div>
                        <h3 className="font-medium">{item.product.name}</h3>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2 text-lg">
                <div className="flex justify-between border-t pt-2">
                  <p className="font-bold">Total:</p>
                  <p className="font-bold">${cartTotal.toFixed(2)}</p>
                </div>
              </div>
            </>
          ) : (
            <p>Your cart is empty</p>
          )}
        </div>
        
        {/* Shipping Information & Payment Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Shipping & Payment</h2>
          
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, values, setFieldValue }) => (
              <Form className="space-y-4">
                {/* Shipping Information */}
                <h3 className="text-lg font-medium mb-2">Shipping Information</h3>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <Field
                    type="text"
                    id="address"
                    name="address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <ErrorMessage name="address" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <Field
                    type="text"
                    id="city"
                    name="city"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <ErrorMessage name="city" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <Field
                      type="text"
                      id="state"
                      name="state"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <ErrorMessage name="state" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  
                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                      Postal Code
                    </label>
                    <Field
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <ErrorMessage name="postalCode" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <Field
                    type="text"
                    id="country"
                    name="country"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <ErrorMessage name="country" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                
                {/* Payment Method Selection */}
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-3">Payment Method</h3>
                  
                  <div className="space-y-3">
                    <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                      <Field
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        className="h-4 w-4 text-blue-600"
                        onClick={() => setFieldValue('paymentDetails', '')}
                      />
                      <FaMoneyBillWave className="ml-3 text-green-600" />
                      <span className="ml-2">Cash on Delivery</span>
                    </label>
                    
                    <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                      <Field
                        type="radio"
                        name="paymentMethod"
                        value="upi"
                        className="h-4 w-4 text-blue-600"
                      />
                      <FaMobile className="ml-3 text-blue-600" />
                      <span className="ml-2">UPI</span>
                    </label>
                    
                    <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                      <Field
                        type="radio"
                        name="paymentMethod"
                        value="net_banking"
                        className="h-4 w-4 text-blue-600"
                      />
                      <FaUniversity className="ml-3 text-purple-600" />
                      <span className="ml-2">Net Banking</span>
                    </label>
                  </div>
                  
                  <ErrorMessage name="paymentMethod" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                
                {/* Payment Details (conditionally rendered) */}
                {(values.paymentMethod === 'upi' || values.paymentMethod === 'net_banking') && (
                  <div className="mt-4">
                    <label htmlFor="paymentDetails" className="block text-sm font-medium text-gray-700 mb-1">
                      {values.paymentMethod === 'upi' ? 'UPI ID' : 'Bank Account Details'}
                    </label>
                    <Field
                      as="textarea"
                      id="paymentDetails"
                      name="paymentDetails"
                      rows="3"
                      placeholder={values.paymentMethod === 'upi' 
                        ? 'Enter your UPI ID (e.g., yourname@ybl)' 
                        : 'Enter your bank name, account number, and IFSC code'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <ErrorMessage name="paymentDetails" component="div" className="text-red-500 text-sm mt-1" />
                    {values.paymentMethod === 'upi' && (
                      <p className="text-xs text-gray-500 mt-1">
                        UPI payments will be confirmed upon verification
                      </p>
                    )}
                    {values.paymentMethod === 'net_banking' && (
                      <p className="text-xs text-gray-500 mt-1">
                        Your bank account details are secure and only used for this transaction
                      </p>
                    )}
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={isLoading || isSubmitting || cartItems.length === 0}
                  className="w-full mt-6 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <FaSpinner className="animate-spin mr-2" />
                      Processing...
                    </span>
                  ) : (
                    'Place Order'
                  )}
                </button>
                
                {error && (
                  <div className="text-red-500 text-sm mt-2">
                    {error}
                  </div>
                )}
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage; 