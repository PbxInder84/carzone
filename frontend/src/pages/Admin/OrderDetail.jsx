import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaTruck, FaCheck } from 'react-icons/fa';
import * as orderService from '../../db/orderService';
import Spinner from '../../components/common/Spinner';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingAction, setProcessingAction] = useState(false);

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderService.getOrderById(id);
      console.log('Order API response:', response);
      
      // Make sure we handle different response structures
      const orderData = response.data || response;
      
      setOrder(orderData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching order details:', error);
      setError('Failed to load order details. Please try again.');
      setLoading(false);
    }
  };

  const updateOrderStatus = async (newStatus) => {
    try {
      setProcessingAction(true);
      await orderService.updateOrderStatus(id, newStatus);
      // Update the local state with the new status
      setOrder({ ...order, order_status: newStatus });
      setProcessingAction(false);
    } catch (error) {
      console.error('Error updating order status:', error);
      setProcessingAction(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getNextStatusOptions = (currentStatus) => {
    switch (currentStatus) {
      case 'pending':
        return [{ value: 'processing', label: 'Mark as Processing', icon: <FaTruck /> }];
      case 'processing':
        return [{ value: 'shipped', label: 'Mark as Shipped', icon: <FaTruck /> }];
      case 'shipped':
        return [{ value: 'delivered', label: 'Mark as Delivered', icon: <FaCheck /> }];
      default:
        return [];
    }
  };

  if (loading) return <Spinner />;

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-500 mb-4">{error}</div>
        <Link to="/dashboard/orders" className="text-blue-500 hover:underline">
          Back to Orders
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6 text-center">
        <div className="mb-4">Order not found</div>
        <Link to="/dashboard/orders" className="text-blue-500 hover:underline">
          Back to Orders
        </Link>
      </div>
    );
  }

  const nextStatusOptions = getNextStatusOptions(order.order_status);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Order Details</h1>
        <Link to="/dashboard/orders" className="flex items-center text-gray-600 hover:text-gray-900">
          <FaArrowLeft className="mr-2" /> Back to Orders
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="p-6 border-b">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-2">Order #{order.id}</h2>
              <p className="text-gray-600">Placed on {formatDate(order.created_at)}</p>
            </div>

            <div className="mt-4 md:mt-0">
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeColor(
                  order.order_status
                )}`}
              >
                {order.order_status}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700">Customer</h4>
              <p>{order.user?.name || 'N/A'}</p>
              <p>{order.user?.email || 'N/A'}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">Shipping Address</h4>
              <p className="whitespace-pre-line">{order.shipping_address || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium text-gray-700">Payment Method</h4>
              <p className="capitalize">{order.payment_method || 'N/A'}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">Payment Status</h4>
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  order.payment_status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : order.payment_status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {order.payment_status || 'N/A'}
              </span>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">Payment Date</h4>
              <p>{order.payment_date ? formatDate(order.payment_date) : 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Order Items</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(order.orderItems || order.items || []).length > 0 ? (
                  (order.orderItems || order.items || []).map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {item.product?.image_url && (
                            <div className="flex-shrink-0 h-10 w-10 mr-4">
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={item.product.image_url}
                                alt={item.product?.name || 'Product'}
                              />
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {item.product?.name || 'Unknown Product'}
                            </div>
                            <div className="text-sm text-gray-500">
                              Seller: {item.seller?.name || 'Unknown Seller'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatCurrency(item.price_at_time_of_order)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.quantity}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {formatCurrency(item.price_at_time_of_order * item.quantity)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                      No items found for this order
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-right font-medium">
                    Total
                  </td>
                  <td className="px-6 py-4 text-right font-bold">
                    {formatCurrency(order.total_amount)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Order Actions</h3>
        
        {order.order_status !== 'delivered' && order.order_status !== 'cancelled' ? (
          <div className="flex flex-wrap gap-4">
            {nextStatusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => updateOrderStatus(option.value)}
                disabled={processingAction}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {option.icon && <span className="mr-2">{option.icon}</span>}
                {option.label}
              </button>
            ))}
            
            {order.order_status !== 'cancelled' && (
              <button
                onClick={() => updateOrderStatus('cancelled')}
                disabled={processingAction}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                Cancel Order
              </button>
            )}
          </div>
        ) : (
          <p className="text-gray-600">
            This order is {order.order_status === 'delivered' ? 'complete' : 'cancelled'} and cannot be modified.
          </p>
        )}
      </div>
    </div>
  );
};

export default OrderDetail; 