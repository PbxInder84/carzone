import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  FaUsers, 
  FaShoppingCart, 
  FaCar, 
  FaDollarSign,
  FaExternalLinkAlt,
  FaTags,
  FaTrash
} from 'react-icons/fa';
import * as userService from '../db/userService';
import * as orderService from '../db/orderService';
import * as productService from '../db/productService';
import * as categoryService from '../db/categoryService';
import axios from 'axios';
import Spinner from '../components/common/Spinner';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const userRole = user?.role || user?.data?.role;
  const isAdmin = userRole === 'admin';
  const isSeller = userRole === 'seller';
  
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    totalCategories: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentCategories, setRecentCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetConfirmText, setResetConfirmText] = useState('');
  
  const fetchDashboardData = async () => {
    setIsLoading(true);
    
    try {
      // Create an array of promises to fetch data
      const promises = [];
      const results = {};
      
      // Always fetch products and categories (both admin and seller need these)
      promises.push(
        productService.getAllProducts(1, 1)
          .then(response => {
            results.products = response;
          })
          .catch(error => {
            console.error('Error fetching products:', error);
          })
      );
      
      promises.push(
        categoryService.getAllCategories()
          .then(response => {
            results.categories = response;
          })
          .catch(error => {
            console.error('Error fetching categories:', error);
          })
      );
      
      // Always fetch orders
      promises.push(
        orderService.getAllOrders(1, 5)
          .then(response => {
            results.orders = response;
          })
          .catch(error => {
            console.error('Error fetching orders:', error);
          })
      );
      
      // Only fetch users if admin
      if (isAdmin) {
        promises.push(
          userService.getAllUsers(1, 4)
            .then(response => {
              results.users = response;
            })
            .catch(error => {
              console.error('Error fetching users:', error);
            })
        );
      }
      
      // Wait for all promises to resolve
      await Promise.allSettled(promises);
      
      // Calculate total revenue from orders if available
      const totalRevenue = results.orders?.data?.reduce(
        (acc, order) => acc + parseFloat(order.total_amount || 0), 
        0
      ) || 0;
      
      // Set stats based on available data
      setStats({
        totalProducts: results.products?.count || 0,
        totalOrders: results.orders?.count || 0,
        totalUsers: results.users?.count || 0,
        totalRevenue: totalRevenue,
        totalCategories: results.categories?.count || 0
      });
      
      // Set recent data based on available results
      if (results.orders) {
        setRecentOrders(results.orders.data || []);
      }
      
      if (results.users) {
        setRecentUsers(results.users.data || []);
      }
      
      if (results.categories) {
        setRecentCategories(results.categories.data || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchDashboardData();
  }, [isAdmin]); // eslint-disable-line react-hooks/exhaustive-deps
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'delivered':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
      case 'canceled':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const handleResetData = async () => {
    if (resetConfirmText !== 'CONFIRM_RESET') {
      alert('Please type CONFIRM_RESET to proceed with database reset');
      return;
    }
    
    try {
      setIsResetting(true);
      
      const token = localStorage.getItem('user') 
        ? JSON.parse(localStorage.getItem('user')).token 
        : null;
      
      const response = await axios.delete('/api/admin/reset', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        data: { confirm: 'CONFIRM_RESET' }
      });
      
      // Show success message
      alert(response.data.message);
      
      // Reset state
      setResetConfirmText('');
      setShowResetConfirm(false);
      
      // Reload dashboard data
      fetchDashboardData();
    } catch (error) {
      console.error('Error resetting database:', error);
      alert(error.response?.data?.error || 'Failed to reset database');
    } finally {
      setIsResetting(false);
    }
  };
  
  if (isLoading) {
    return <Spinner />;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
        <div className="flex items-center">
          {isAdmin && (
            <button 
              onClick={() => setShowResetConfirm(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm flex items-center mr-4"
            >
              <FaTrash className="mr-2" />
              Reset Data
            </button>
          )}
          <p className="text-sm text-gray-300">
            Welcome back, <span className="font-semibold">{user?.name || user?.data?.name}</span>
          </p>
        </div>
      </div>
      
      {/* Reset Data Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-red-600 mb-4">Confirm Database Reset</h2>
            <p className="text-gray-700 mb-4">
              This action will delete all products, categories, orders, and reviews from the database.
              This cannot be undone. User accounts will be preserved.
            </p>
            <p className="text-gray-700 mb-4 font-bold">
              To confirm, type "CONFIRM_RESET" in the box below:
            </p>
            <input
              type="text"
              value={resetConfirmText}
              onChange={(e) => setResetConfirmText(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 mb-4"
              placeholder="CONFIRM_RESET"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowResetConfirm(false);
                  setResetConfirmText('');
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
                disabled={isResetting}
              >
                Cancel
              </button>
              <button
                onClick={handleResetData}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center"
                disabled={resetConfirmText !== 'CONFIRM_RESET' || isResetting}
              >
                {isResetting ? (
                  <>
                    <span className="mr-2">Resetting...</span>
                    <Spinner size="sm" />
                  </>
                ) : (
                  'Reset Database'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FaCar className="text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Products</p>
              <p className="text-2xl font-semibold text-gray-800">{stats.totalProducts}</p>
            </div>
          </div>
          <div className="mt-3">
            <Link to="/admin/products" className="text-sm text-blue-600 hover:underline">
              Manage Products
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FaShoppingCart className="text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <p className="text-2xl font-semibold text-gray-800">{stats.totalOrders}</p>
            </div>
          </div>
          <div className="mt-3">
            <Link to="/admin/orders" className="text-sm text-green-600 hover:underline">
              View Orders
            </Link>
          </div>
        </div>
        
        {isAdmin && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <FaUsers className="text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <p className="text-2xl font-semibold text-gray-800">{stats.totalUsers}</p>
              </div>
            </div>
            <div className="mt-3">
              <Link to="/admin/users" className="text-sm text-purple-600 hover:underline">
                Manage Users
              </Link>
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              {isAdmin ? (
                <FaDollarSign className="text-xl" />
              ) : (
                <FaTags className="text-xl" />
              )}
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                {isAdmin ? 'Total Revenue' : 'Categories'}
              </p>
              <p className="text-2xl font-semibold text-gray-800">
                {isAdmin ? formatCurrency(stats.totalRevenue) : stats.totalCategories}
              </p>
            </div>
          </div>
          {!isAdmin && (
            <div className="mt-3">
              <Link to="/admin/categories" className="text-sm text-yellow-600 hover:underline">
                View Categories
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-semibold text-gray-800">Recent Orders</h2>
          <Link 
            to="/admin/orders" 
            className="text-sm text-primary-600 hover:text-primary-800 flex items-center"
          >
            View All
            <FaExternalLinkAlt className="ml-1 text-xs" />
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          {recentOrders && recentOrders.length > 0 ? (
            <table className="w-full">
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
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {order.user?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full capitalize ${getStatusColor(order.order_status)}`}>
                        {order.order_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                      {formatCurrency(order.total_amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to={`/admin/orders/${order.id}`} className="text-primary-600 hover:text-primary-800">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-8 text-center text-gray-500">No recent orders found</div>
          )}
        </div>
      </div>
      
      {/* Categories Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-semibold text-gray-800">Categories</h2>
          <Link 
            to="/admin/categories" 
            className="text-sm text-primary-600 hover:text-primary-800 flex items-center"
          >
            Manage Categories
            <FaExternalLinkAlt className="ml-1 text-xs" />
          </Link>
        </div>
        
        <div className="p-6">
          {recentCategories && recentCategories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentCategories.slice(0, 6).map((category) => (
                <div key={category.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {category.description || 'No description available'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-gray-500">
                    Created: {formatDate(category.created_at)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">No categories found</div>
          )}
        </div>
      </div>
      
      {/* Recent Users (Admin Only) */}
      {isAdmin && recentUsers && recentUsers.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="font-semibold text-gray-800">Recent Users</h2>
            <Link 
              to="/admin/users" 
              className="text-sm text-primary-600 hover:text-primary-800 flex items-center"
            >
              View All
              <FaExternalLinkAlt className="ml-1 text-xs" />
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : user.role === 'seller' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.created_at || user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to={`/admin/users/${user.id}`} className="text-primary-600 hover:text-primary-800">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 