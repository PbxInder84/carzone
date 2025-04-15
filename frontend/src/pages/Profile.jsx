import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../features/auth/authSlice';
import Spinner from '../components/layout/Spinner';
import { FaUser, FaEnvelope, FaUserTag, FaIdCard, FaEdit, FaKey, FaBox, FaTachometerAlt, FaShieldAlt, FaCalendarAlt, FaHistory } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    // Fetch current user data if needed
    if (!user.data) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, user]);

  const handleEditProfile = () => {
    navigate('/profile/edit');
  };

  const handleChangePassword = () => {
    navigate('/profile/change-password');
  };

  const handleManageProducts = () => {
    if (user?.data?.role === 'seller') {
      navigate('/seller/products');
    } else if (user?.data?.role === 'admin') {
      navigate('/admin/products');
    } else {
      toast.error('You do not have permission to access this page');
    }
  };

  const handleAdminDashboard = () => {
    navigate('/admin/dashboard');
  };

  const handleOrderHistory = () => {
    navigate('/profile/orders');
  };

  if (isLoading || !user) {
    return <Spinner />;
  }

  const userData = user.data || {};

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary-800 text-white mb-12">
        {/* Background effects */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-primary-700"></div>
        </div>
        <div className="absolute -right-20 top-10 w-64 h-64 bg-secondary-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -left-20 bottom-10 w-64 h-64 bg-primary-400/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-lg">
              <FaUser className="text-4xl" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 leading-tight">
              {userData.name || 'My Profile'}
            </h1>
            <p className="text-lg text-gray-100">
              Member since {userData.createdAt 
                ? new Date(userData.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric'
                  }) 
                : 'Not available'}
            </p>
          </div>
        </div>
      </section>
      
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Profile Information */}
            <div className="md:col-span-2">
              <div className="backdrop-blur-sm bg-white/80 rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="bg-primary-100 p-2 rounded-full text-primary-600 mr-3">
                      <FaShieldAlt className="text-lg" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Account Information</h2>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoCard 
                      icon={<FaUser />}
                      label="Full Name"
                      value={userData.name || 'Not available'} 
                    />
                    
                    <InfoCard 
                      icon={<FaEnvelope />}
                      label="Email Address"
                      value={userData.email || 'Not available'} 
                    />
                    
                    <InfoCard 
                      icon={<FaUserTag />}
                      label="Account Type"
                      value={userData.role ? userData.role.charAt(0).toUpperCase() + userData.role.slice(1) : 'User'} 
                    />
                    
                    <InfoCard 
                      icon={<FaCalendarAlt />}
                      label="Member Since"
                      value={userData.createdAt 
                        ? new Date(userData.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric'
                          }) 
                        : 'Not available'} 
                    />
                  </div>
                </div>
              </div>
              
              {/* Order History Preview */}
              <div className="backdrop-blur-sm bg-white/80 rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-primary-100 p-2 rounded-full text-primary-600 mr-3">
                        <FaHistory className="text-lg" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
                    </div>
                    <button 
                      onClick={handleOrderHistory}
                      className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                    >
                      View All
                    </button>
                  </div>
                </div>
                
                <div className="p-6 text-center">
                  <p className="text-gray-600 mb-4">Your recent order history will appear here.</p>
                  <button
                    onClick={handleOrderHistory}
                    className="inline-flex items-center px-4 py-2 bg-primary-50 text-primary-700 rounded-full font-medium hover:bg-primary-100 transition-colors"
                  >
                    <FaHistory className="mr-2" /> View Order History
                  </button>
                </div>
              </div>
            </div>
            
            {/* Account Actions */}
            <div className="md:col-span-1">
              <div className="backdrop-blur-sm bg-white/80 rounded-2xl shadow-xl border border-gray-100 p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Account Actions</h2>
                
                <div className="space-y-4">
                  <ActionButton 
                    icon={<FaEdit />}
                    text="Edit Profile"
                    onClick={handleEditProfile}
                    primary
                  />
                  
                  <ActionButton 
                    icon={<FaKey />}
                    text="Change Password"
                    onClick={handleChangePassword}
                  />
                  
                  <ActionButton 
                    icon={<FaHistory />}
                    text="Order History"
                    onClick={handleOrderHistory}
                  />
                  
                  {userData.role === 'seller' && (
                    <ActionButton 
                      icon={<FaBox />}
                      text="Manage Products"
                      onClick={handleManageProducts}
                      secondary
                    />
                  )}
                  
                  {userData.role === 'admin' && (
                    <ActionButton 
                      icon={<FaTachometerAlt />}
                      text="Admin Dashboard"
                      onClick={handleAdminDashboard}
                      secondary
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ icon, label, value }) => (
  <div className="backdrop-blur-sm bg-white/60 rounded-xl p-4 transform transition-all duration-300 hover:shadow-md hover:-translate-y-1 border border-gray-100">
    <div className="flex items-start">
      <div className="bg-primary-100 p-2.5 rounded-full text-primary-600 mr-4 flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-gray-500 text-sm mb-1">{label}</p>
        <p className="font-medium text-gray-800">{value}</p>
      </div>
    </div>
  </div>
);

const ActionButton = ({ icon, text, onClick, primary, secondary }) => (
  <button 
    onClick={onClick}
    className={`w-full py-3 px-4 rounded-full font-medium flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-lg ${
      primary 
        ? 'bg-primary-600 text-white hover:bg-primary-700' 
        : secondary 
          ? 'bg-secondary-600 text-white hover:bg-secondary-700' 
          : 'bg-white text-gray-800 hover:bg-gray-50 border border-gray-200'
    }`}
  >
    <span className="mr-2">{icon}</span>
    {text}
  </button>
);

export default Profile; 