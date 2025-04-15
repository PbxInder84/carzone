import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { fetchOrderConfirmation, updatePaymentDetails } from '../features/checkout/checkoutSlice';
import { FaSpinner, FaShoppingCart, FaTruck, FaCheck, FaExclamationTriangle, FaMoneyBillWave, FaMobile, FaUniversity, FaEdit, FaCheckCircle, FaShoppingBag, FaFileInvoice, FaPrint, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { formatCurrency } from '../utils/formatters';

// Helper function to safely format prices
const formatPrice = (price) => {
  return formatCurrency(price, true);
};

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  
  const { orderConfirmation, isLoading, error } = useSelector((state) => state.checkout);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  
  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderConfirmation(orderId));
    }
  }, [dispatch, orderId]);
  
  // Form validation schema for payment updates
  const paymentValidationSchema = Yup.object({
    paymentDetails: Yup.string().required('Payment details are required')
  });
  
  // Handle payment details update
  const handlePaymentUpdate = (values) => {
    dispatch(updatePaymentDetails({
      orderId,
      paymentDetails: values.paymentDetails
    }));
    setShowPaymentForm(false);
  };
  
  // Get payment method icon
  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'cod':
        return <FaMoneyBillWave className="text-green-600" />;
      case 'upi':
        return <FaMobile className="text-blue-600" />;
      case 'net_banking':
        return <FaUniversity className="text-purple-600" />;
      default:
        return <FaMoneyBillWave className="text-green-600" />;
    }
  };
  
  // Format payment method name
  const formatPaymentMethod = (method) => {
    switch (method) {
      case 'cod':
        return 'Cash on Delivery';
      case 'upi':
        return 'UPI';
      case 'net_banking':
        return 'Net Banking';
      default:
        return method;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <FaExclamationTriangle className="text-5xl text-red-500 mb-4 mx-auto" />
        <h1 className="text-2xl font-bold mb-4">Error Loading Order</h1>
        <p className="mb-6">{error}</p>
        <Link 
          to="/cart" 
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Return to Cart
        </Link>
      </div>
    );
  }
  
  if (!orderConfirmation) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
        <p className="mb-6">The order details could not be found.</p>
        <Link 
          to="/cart" 
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Return to Cart
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 text-center">
        <FaCheck className="text-5xl text-green-500 mb-4 mx-auto" />
        <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-lg mb-2">Thank you for your purchase.</p>
        <p className="text-gray-600">
          Your order #{orderConfirmation.id} has been placed successfully.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Order Items</h2>
            
            <div className="divide-y">
              {orderConfirmation.orderItems.map((item) => (
                <div key={item.id} className="py-4 flex items-center">
                  <img 
                    src={item.product.image_url} 
                    alt={item.product.name} 
                    className="w-20 h-20 object-cover rounded mr-4"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder-image.jpg';
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-lg">{item.product.name}</h3>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">Quantity: {item.quantity} × {formatCurrency(item.price_at_time_of_order)}</span>
                      <span className="font-semibold">
                        {formatCurrency(item.quantity * item.price_at_time_of_order)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
            <p className="mb-2">
              <span className="font-semibold">Address:</span> {orderConfirmation.shipping_address}
            </p>
            <div className="mt-4 flex items-center text-gray-600">
              <FaTruck className="mr-2" />
              <p>Your order will be processed and shipped soon.</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Payment Information</h2>
              {orderConfirmation.payment_status === 'pending' && 
               (orderConfirmation.payment_method === 'upi' || orderConfirmation.payment_method === 'net_banking') && (
                <button 
                  className="text-blue-600 flex items-center"
                  onClick={() => setShowPaymentForm(!showPaymentForm)}
                >
                  <FaEdit className="mr-1" />
                  {showPaymentForm ? 'Cancel' : 'Update Payment Details'}
                </button>
              )}
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center pb-2 border-b">
                <span className="font-semibold mr-2">Payment Method:</span>
                <div className="flex items-center">
                  {getPaymentMethodIcon(orderConfirmation.payment_method)}
                  <span className="ml-2">{formatPaymentMethod(orderConfirmation.payment_method)}</span>
                </div>
              </div>
              
              <div className="flex justify-between pb-2 border-b">
                <span className="font-semibold">Payment Status:</span>
                <span className={`font-medium capitalize ${
                  orderConfirmation.payment_status === 'completed' 
                    ? 'text-green-600' 
                    : orderConfirmation.payment_status === 'failed' 
                      ? 'text-red-600' 
                      : 'text-yellow-600'
                }`}>
                  {orderConfirmation.payment_status}
                </span>
              </div>
              
              {orderConfirmation.payment_details && (
                <div className="pb-2 border-b">
                  <span className="font-semibold block mb-1">Payment Details:</span>
                  <span className="text-gray-700 block">{orderConfirmation.payment_details}</span>
                </div>
              )}
              
              {orderConfirmation.payment_date && (
                <div className="flex justify-between pb-2 border-b">
                  <span className="font-semibold">Payment Date:</span>
                  <span className="font-medium">
                    {new Date(orderConfirmation.payment_date).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
            
            {/* Payment update form */}
            {showPaymentForm && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <h3 className="text-lg font-medium mb-3">
                  Update {orderConfirmation.payment_method === 'upi' ? 'UPI' : 'Bank'} Details
                </h3>
                
                <Formik
                  initialValues={{ paymentDetails: orderConfirmation.payment_details || '' }}
                  validationSchema={paymentValidationSchema}
                  onSubmit={handlePaymentUpdate}
                >
                  {({ isSubmitting }) => (
                    <Form>
                      <div className="mb-3">
                        <Field
                          as="textarea"
                          id="paymentDetails"
                          name="paymentDetails"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          rows="3"
                          placeholder={orderConfirmation.payment_method === 'upi' 
                            ? 'Enter your UPI ID (e.g., yourname@ybl)' 
                            : 'Enter your bank name, account number, and IFSC code'}
                        />
                        <ErrorMessage name="paymentDetails" component="div" className="text-red-500 text-sm mt-1" />
                      </div>
                      
                      <div className="flex justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => setShowPaymentForm(false)}
                          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                          {isSubmitting ? (
                            <span className="flex items-center">
                              <FaSpinner className="animate-spin mr-2" />
                              Updating...
                            </span>
                          ) : (
                            'Save Details'
                          )}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            )}
            
            {orderConfirmation.payment_method === 'cod' && (
              <div className="mt-4 p-4 bg-yellow-50 rounded-md text-yellow-800">
                <div className="flex items-center">
                  <FaMoneyBillWave className="text-lg mr-2" />
                  <p>Please keep the exact amount ready for payment upon delivery.</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between pb-2 border-b">
                <span>Order ID:</span>
                <span className="font-medium">{orderConfirmation.id}</span>
              </div>
              <div className="flex justify-between pb-2 border-b">
                <span>Order Date:</span>
                <span className="font-medium">
                  {new Date(orderConfirmation.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between pb-2 border-b">
                <span>Order Status:</span>
                <span className="font-medium capitalize">{orderConfirmation.order_status}</span>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <div className="flex justify-between pb-2">
                <span className="font-bold">Total Amount:</span>
                <span className="font-bold text-xl">{formatCurrency(orderConfirmation.total_amount)}</span>
              </div>
            </div>
            
            <div className="mt-6">
              <Link 
                to="/products" 
                className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700"
              >
                <FaShoppingCart className="inline-block mr-2" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation; 