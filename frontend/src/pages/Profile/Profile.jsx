import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaSave, FaTimes, FaCamera } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { userService } from '../../db/userService';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    profileImage: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        profileImage: user.profileImage || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [user]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Update user profile in the database
      const updatedUser = await userService.updateUser(user.id, {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        profileImage: formData.profileImage
      });
      
      // Update the user in Redux store (you'll need to implement updateUserProfile action)
      // dispatch(updateUserProfile(updatedUser));
      
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    // Password validation
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (formData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    
    try {
      // Change password in the database
      await userService.changePassword(user.id, formData.currentPassword, formData.newPassword);
      
      // Reset password fields
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setIsChangingPassword(false);
      toast.success('Password changed successfully');
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Failed to change password. Please check your current password.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({
          ...formData,
          profileImage: event.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-6 text-white">
          <div className="flex flex-col md:flex-row items-center">
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-white bg-opacity-20 flex items-center justify-center overflow-hidden">
                {formData.profileImage ? (
                  <img 
                    src={formData.profileImage} 
                    alt={formData.name} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-4xl">{formData.name.charAt(0)}</span>
                )}
              </div>
              {isEditing && (
                <label htmlFor="profile-image" className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow cursor-pointer">
                  <FaCamera className="text-primary-600" />
                  <input 
                    type="file" 
                    id="profile-image" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>
            <div className="md:ml-6 mt-4 md:mt-0 text-center md:text-left">
              <h2 className="text-xl font-semibold">{formData.name}</h2>
              <p>{formData.email}</p>
              <p className="text-sm text-white text-opacity-80">{user?.role}</p>
            </div>
          </div>
        </div>
        
        {/* Profile Form */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Personal Information</h3>
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="bg-primary-100 text-primary-700 px-4 py-2 rounded-lg hover:bg-primary-200"
              >
                Edit Profile
              </button>
            )}
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="border rounded-lg px-3 py-2 w-full"
                  disabled={!isEditing}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="border rounded-lg px-3 py-2 w-full bg-gray-100"
                  disabled={true}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="border rounded-lg px-3 py-2 w-full"
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Image URL
                </label>
                <input
                  type="text"
                  name="profileImage"
                  value={formData.profileImage}
                  onChange={handleChange}
                  className="border rounded-lg px-3 py-2 w-full"
                  disabled={!isEditing}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="border rounded-lg px-3 py-2 w-full"
                  disabled={!isEditing}
                  rows="3"
                />
              </div>
            </div>
            
            {isEditing && (
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    if (user) {
                      setFormData({
                        ...formData,
                        name: user.name || '',
                        phone: user.phone || '',
                        address: user.address || '',
                        profileImage: user.profileImage || ''
                      });
                    }
                  }}
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
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <FaSave className="mr-2" /> Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
        
        {/* Password Change Section */}
        <div className="border-t p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Change Password</h3>
            {!isChangingPassword && (
              <button 
                onClick={() => setIsChangingPassword(true)}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
              >
                Change Password
              </button>
            )}
          </div>
          
          {isChangingPassword && (
            <form onSubmit={handlePasswordChange}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                <div className="md:col-span-2">
                  <hr className="my-2" />
                </div>
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
                  onClick={() => {
                    setIsChangingPassword(false);
                    setFormData({
                      ...formData,
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    });
                  }}
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
                      <FaSave className="mr-2" /> Update Password
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile; 