import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from '../features/auth/authSlice';
import Spinner from '../components/layout/Spinner';
import { FaUser, FaEnvelope, FaUserTag, FaIdCard } from 'react-icons/fa';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    // Fetch current user data if needed
    if (!user.data) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, user]);

  if (isLoading || !user) {
    return <Spinner />;
  }

  const userData = user.data || {};

  return (
    <section className="page-container">
      <div className="max-w-3xl mx-auto">
        <h1 className="page-title">My Profile</h1>
        
        <div className="card">
          <div className="flex items-center justify-center mb-6">
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
              <FaUser className="text-4xl" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-b pb-4 md:border-b-0 md:border-r md:pr-6">
              <h2 className="text-xl font-semibold mb-4">Account Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <FaUser className="text-primary-600 mr-3" />
                  <div>
                    <p className="text-gray-500 text-sm">Name</p>
                    <p className="font-medium">{userData.name || 'Not available'}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <FaEnvelope className="text-primary-600 mr-3" />
                  <div>
                    <p className="text-gray-500 text-sm">Email</p>
                    <p className="font-medium">{userData.email || 'Not available'}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <FaUserTag className="text-primary-600 mr-3" />
                  <div>
                    <p className="text-gray-500 text-sm">Role</p>
                    <p className="font-medium capitalize">{userData.role || 'User'}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <FaIdCard className="text-primary-600 mr-3" />
                  <div>
                    <p className="text-gray-500 text-sm">Member Since</p>
                    <p className="font-medium">
                      {userData.createdAt 
                        ? new Date(userData.createdAt).toLocaleDateString() 
                        : 'Not available'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-4 md:pt-0 md:pl-6">
              <h2 className="text-xl font-semibold mb-4">Account Actions</h2>
              
              <div className="space-y-4">
                <button className="btn-primary w-full">
                  Edit Profile
                </button>
                
                <button className="btn-outline w-full">
                  Change Password
                </button>
                
                {userData.role === 'seller' && (
                  <button className="btn-secondary w-full">
                    Manage Products
                  </button>
                )}
                
                {userData.role === 'admin' && (
                  <button className="btn-secondary w-full">
                    Admin Dashboard
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile; 