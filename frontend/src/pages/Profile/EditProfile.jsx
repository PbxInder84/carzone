import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaSave, FaTimes, FaCamera, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Spinner from '../../components/layout/Spinner';
import { getCurrentUser } from '../../features/auth/authSlice';
import { updateUser } from '../../db/userService';

const EditProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    profileImage: ''
  });
  
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (!user.data) {
      dispatch(getCurrentUser());
    } else {
      setFormData({
        name: user.data.name || '',
        email: user.data.email || '',
        phone: user.data.phone || '',
        address: user.data.address || '',
        profileImage: user.data.profileImage || ''
      });
    }
  }, [user, navigate, dispatch]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
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
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Update user profile in the database
      await updateUser(user.data.id, {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        profileImage: formData.profileImage
      });
      
      // Refresh the user data in Redux store
      dispatch(getCurrentUser());
      
      toast.success('Profile updated successfully');
      navigate('/profile');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
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
          <h1 className="page-title m-0">Edit Profile</h1>
        </div>
        
        <div className="card">
          <form onSubmit={handleSubmit}>
            {/* Profile Image */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
                  {formData.profileImage ? (
                    <img 
                      src={formData.profileImage} 
                      alt={formData.name} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl text-primary-600">{formData.name.charAt(0)}</span>
                  )}
                </div>
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
              </div>
            </div>
            
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
                  placeholder="(123) 456-7890"
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
                  rows="3"
                  placeholder="Enter your address"
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
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" /> Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default EditProfile; 