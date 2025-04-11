import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaSearch, FaUserShield, FaStore, FaUser } from 'react-icons/fa';
import * as userService from '../../db/userService';
import Spinner from '../../components/common/Spinner';
import { toast } from 'react-toastify';

// Define user roles
const USER_ROLES = {
  ADMIN: 'admin',
  SELLER: 'seller',
  CUSTOMER: 'user'
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchUsers();
  }, [currentPage, roleFilter, searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Use getMockUsers for development until API is ready
      const response = userService.getMockUsers(currentPage, pageSize);
      
      setUsers(response.data);
      setTotalPages(response.pagination.pages);
      setLoading(false);

      // When API is ready, uncomment the following code:
      /*
      const response = await userService.getAllUsers(currentPage, pageSize, {
        search: searchTerm,
        role: roleFilter !== 'all' ? roleFilter : undefined,
        sortBy: 'createdAt',
      });
      
      setUsers(response.data);
      setTotalPages(response.pagination.pages);
      */
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchUsers();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getUserRoleIcon = (role) => {
    switch (role) {
      case USER_ROLES.ADMIN:
        return <FaUserShield className="text-purple-500" />;
      case USER_ROLES.SELLER:
        return <FaStore className="text-green-500" />;
      default:
        return <FaUser className="text-blue-500" />;
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case USER_ROLES.ADMIN:
        return 'bg-purple-100 text-purple-800';
      case USER_ROLES.SELLER:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await userService.updateUser(userId, { role: newRole });
      setUsers(
        users.map((user) => 
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
      toast.success(`User role updated to ${newRole}`);
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await userService.deleteUser(userId);
        setUsers(users.filter(user => user.id !== userId));
        toast.success('User deleted successfully');
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user');
      }
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">User Management</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row justify-between mb-6">
          <form onSubmit={handleSearch} className="flex mb-4 md:mb-0">
            <input
              type="text"
              placeholder="Search users..."
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
              onClick={() => setRoleFilter('all')}
              className={`px-3 py-2 rounded-lg ${
                roleFilter === 'all'
                  ? 'bg-gray-200 text-gray-800'
                  : 'bg-white text-gray-600 border'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setRoleFilter(USER_ROLES.ADMIN)}
              className={`px-3 py-2 rounded-lg ${
                roleFilter === USER_ROLES.ADMIN
                  ? 'bg-purple-200 text-purple-800'
                  : 'bg-white text-gray-600 border'
              }`}
            >
              Admins
            </button>
            <button
              onClick={() => setRoleFilter(USER_ROLES.SELLER)}
              className={`px-3 py-2 rounded-lg ${
                roleFilter === USER_ROLES.SELLER
                  ? 'bg-green-200 text-green-800'
                  : 'bg-white text-gray-600 border'
              }`}
            >
              Sellers
            </button>
            <button
              onClick={() => setRoleFilter(USER_ROLES.CUSTOMER)}
              className={`px-3 py-2 rounded-lg ${
                roleFilter === USER_ROLES.CUSTOMER
                  ? 'bg-blue-200 text-blue-800'
                  : 'bg-white text-gray-600 border'
              }`}
            >
              Customers
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
                      User
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
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            {user.profileImage ? (
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={user.profileImage}
                                alt={user.name}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                {getUserRoleIcon(user.role)}
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(
                            user.role
                          )}`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(user.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end items-center">
                          <div className="relative inline-block text-left mr-2">
                            <select
                              className="border border-gray-300 rounded-md text-sm px-2 py-1"
                              value={user.role}
                              onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            >
                              <option value={USER_ROLES.CUSTOMER}>{USER_ROLES.CUSTOMER}</option>
                              <option value={USER_ROLES.SELLER}>{USER_ROLES.SELLER}</option>
                              <option value={USER_ROLES.ADMIN}>{USER_ROLES.ADMIN}</option>
                            </select>
                          </div>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-900 ml-2"
                          >
                            <FaTrash className="inline" />
                          </button>
                        </div>
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
                {Math.min(currentPage * pageSize, users.length + (currentPage - 1) * pageSize)}{' '}
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

export default Users; 