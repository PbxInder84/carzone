import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaSave, FaTimes, FaArrowLeft, FaLock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Spinner from '../../components/layout/Spinner';
import { changePassword } from '../../db/userService';

const ChangePassword = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Password validation
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (formData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    
    setLoading(true);
    
    try {
      // Change password in the database
      await changePassword(
        user.data.id,
        formData.currentPassword,
        formData.newPassword
      );
      
      // Reset form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      toast.success('Password changed successfully');
      navigate('/profile');
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Failed to change password. Please check your current password.');
    } finally {
      setLoading(false);
    }
  };
  
  if (isLoading || !user || !user.data) {
    return <Spinner />;
  }
  
  return (
    <section className="page-container">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate('/profile')}
            className="mr-4 bg-gray-100 hover:bg-gray-200 p-2 rounded-full"
          >
            <FaArrowLeft />
          </button>
          <h1 className="page-title m-0">Change Password</h1>
        </div>
        
        <div className="card">
          <div className="flex justify-center mb-6">
            <div className="h-24 w-24 rounded-full bg-primary-100 flex items-center justify-center">
              <FaLock className="text-primary-600 text-4xl" />
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className="border rounded-lg px-3 py-2 w-full"
                  required
                />
              </div>
              
              <hr className="my-4" />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="border rounded-lg px-3 py-2 w-full"
                  required
                  minLength={6}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Password must be at least 6 characters long
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="border rounded-lg px-3 py-2 w-full"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center"
                disabled={loading}
              >
                <FaTimes className="mr-2" /> Cancel
              </button>
              <button
                type="submit"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" /> Change Password
                  </>
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-medium text-gray-800 mb-2">Password Security Tips</h3>
            <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
              <li>Use a mix of letters, numbers, and special characters</li>
              <li>Avoid using common words or personal information</li>
              <li>Don't reuse passwords across different websites</li>
              <li>Consider using a password manager for better security</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChangePassword; 