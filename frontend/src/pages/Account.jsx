import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Navigate } from 'react-router-dom';
import { FaUser, FaBox, FaHeart, FaAddressCard, FaCreditCard, FaStar } from 'react-icons/fa';
import ProfileForm from '../components/account/ProfileForm';
import AddressBook from '../components/account/AddressBook';
import PaymentMethods from '../components/account/PaymentMethods';
import OrderHistory from '../components/account/OrderHistory';
import WishList from '../components/account/WishList';
import PurchasedProductsList from '../components/reviews/PurchasedProductsList';

const Account = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { user, isLoading } = useSelector((state) => state.auth);

  if (!user) {
    toast.error('You must be logged in to view this page');
    return <Navigate to="/login" />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>
      
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex flex-wrap -mb-px">
          <button
            onClick={() => setActiveTab('profile')}
            className={`${
              activeTab === 'profile'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } py-4 px-1 border-b-2 font-medium text-sm mr-8 flex items-center`}
          >
            <FaUser className="mr-2" /> Profile
          </button>
          
          <button
            onClick={() => setActiveTab('orders')}
            className={`${
              activeTab === 'orders'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } py-4 px-1 border-b-2 font-medium text-sm mr-8 flex items-center`}
          >
            <FaBox className="mr-2" /> Orders
          </button>
          
          <button
            onClick={() => setActiveTab('reviews')}
            className={`${
              activeTab === 'reviews'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } py-4 px-1 border-b-2 font-medium text-sm mr-8 flex items-center`}
          >
            <FaStar className="mr-2" /> Reviews
          </button>
          
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`${
              activeTab === 'wishlist'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } py-4 px-1 border-b-2 font-medium text-sm mr-8 flex items-center`}
          >
            <FaHeart className="mr-2" /> Wishlist
          </button>
          
          <button
            onClick={() => setActiveTab('addresses')}
            className={`${
              activeTab === 'addresses'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } py-4 px-1 border-b-2 font-medium text-sm mr-8 flex items-center`}
          >
            <FaAddressCard className="mr-2" /> Addresses
          </button>
          
          <button
            onClick={() => setActiveTab('payment')}
            className={`${
              activeTab === 'payment'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } py-4 px-1 border-b-2 font-medium text-sm mr-8 flex items-center`}
          >
            <FaCreditCard className="mr-2" /> Payment Methods
          </button>
        </nav>
      </div>
      
      {/* Account Content */}
      <div className="p-4 bg-white rounded-lg shadow mt-4">
        {activeTab === 'profile' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
            <ProfileForm user={user} />
          </div>
        )}
        
        {activeTab === 'orders' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Order History</h2>
            <OrderHistory />
          </div>
        )}
        
        {activeTab === 'reviews' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Your Reviews</h2>
            <PurchasedProductsList />
          </div>
        )}
        
        {activeTab === 'wishlist' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Wishlist</h2>
            <WishList />
          </div>
        )}
        
        {activeTab === 'addresses' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Address Book</h2>
            <AddressBook />
          </div>
        )}
        
        {activeTab === 'payment' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Payment Methods</h2>
            <PaymentMethods />
          </div>
        )}
      </div>
    </div>
  );
};

export default Account; 