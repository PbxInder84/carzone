import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaSearch, FaTruck } from 'react-icons/fa';
import * as orderService from '../../db/orderService';
import Spinner from '../../components/common/Spinner';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filter, searchTerm]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      const response = await orderService.getAllOrders(currentPage, pageSize, {
        search: searchTerm,
        status: filter !== 'all' ? filter : undefined,
        sortBy: 'createdAt',
      });
      
      setOrders(response.data);
      setTotalPages(response.pagination.total_pages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchOrders();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      setOrders(
        orders.map((order) => 
          order.id === orderId ? { ...order, order_status: newStatus } : order
        )
      );
    } catch (error) {
      console.error('Error updating order status:', error);
    }
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

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Order Management</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row justify-between mb-6">
          <form onSubmit={handleSearch} className="flex mb-4 md:mb-0">
            <input
              type="text"
              placeholder="Search orders by ID or customer..."
              className="border rounded-l-lg px-4 py-2 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="submit"
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-r-lg hover:bg-gray-300"
            >
              <FaSearch />
            </button>
          </form>

          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-2 rounded-lg ${
                filter === 'all'
                  ? 'bg-gray-200 text-gray-800'
                  : 'bg-white text-gray-600 border'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-3 py-2 rounded-lg ${
                filter === 'pending'
                  ? 'bg-yellow-200 text-yellow-800'
                  : 'bg-white text-gray-600 border'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('processing')}
              className={`px-3 py-2 rounded-lg ${
                filter === 'processing'
                  ? 'bg-blue-200 text-blue-800'
                  : 'bg-white text-gray-600 border'
              }`}
            >
              Processing
            </button>
            <button
              onClick={() => setFilter('shipped')}
              className={`px-3 py-2 rounded-lg ${
                filter === 'shipped'
                  ? 'bg-purple-200 text-purple-800'
                  : 'bg-white text-gray-600 border'
              }`}
            >
              Shipped
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-3 py-2 rounded-lg ${
                filter === 'completed'
                  ? 'bg-green-200 text-green-800'
                  : 'bg-white text-gray-600 border'
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        {loading ? (
          <Spinner />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {String(order.id)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {order.user?.name || 'Unknown'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.user?.email || 'No email'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {order.created_at ? formatDate(order.created_at) : 'Invalid Date'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {order.total_amount ? formatCurrency(order.total_amount) : '$NaN'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(
                            order.order_status
                          )}`}
                        >
                          {order.order_status || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          to={`/admin/orders/${order.id}`}
                          className="text-primary-600 hover:text-primary-900 mr-4"
                        >
                          <FaEye className="inline" />
                        </Link>
                        {order.order_status === 'pending' && (
                          <button
                            onClick={() =>
                              updateOrderStatus(order.id, 'processing')
                            }
                            className="text-blue-600 hover:text-blue-900 ml-2"
                            title="Mark as Processing"
                          >
                            <FaTruck className="inline" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-700">
                Showing {(currentPage - 1) * pageSize + 1} to{' '}
                {Math.min(currentPage * pageSize, orders.length + (currentPage - 1) * pageSize)}{' '}
                of {totalPages * pageSize} results
              </div>
              <div className="flex">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded-l-lg bg-white text-gray-700 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded-r-lg bg-white text-gray-700 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Orders; 