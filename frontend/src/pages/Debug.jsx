import React from 'react';
import { useSelector } from 'react-redux';
import { useSiteSettings } from '../components/layout/SettingsContext';

const Debug = () => {
  const { settings } = useSiteSettings();
  const { user } = useSelector(state => state.auth);
  const { cart } = useSelector(state => state.cart);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Debug Information</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Environment</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            {JSON.stringify({
              nodeEnv: process.env.NODE_ENV,
              apiUrl: process.env.REACT_APP_API_URL || window.location.origin,
              buildTime: process.env.REACT_APP_BUILD_TIME || 'Not set',
            }, null, 2)}
          </pre>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Current User</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Settings</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            {JSON.stringify(settings, null, 2)}
          </pre>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Shopping Cart</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            {JSON.stringify(cart, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default Debug; 