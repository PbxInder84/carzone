import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
const API_URL = 'http://localhost:5000/api';
import { checkCanReview } from '../../features/reviews/reviewSlice';
import { FaStar } from 'react-icons/fa';

const PurchasedProductsList = () => {
  const [purchasedProducts, setPurchasedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  useEffect(() => {
    if (user) {
      fetchPurchasedProducts();
    }
  }, [user]);
  
  const fetchPurchasedProducts = async () => {
    try {
      setLoading(true);
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      
      const response = await axios.get(`${API_URL}/users/${user.id}/purchased-products`, config);
      setPurchasedProducts(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch purchased products');
      console.error('Error fetching purchased products:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCheckCanReview = async (productId) => {
    try {
      const result = await dispatch(checkCanReview(productId)).unwrap();
      return result.canReview;
    } catch (error) {
      return false;
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  if (!purchasedProducts.length) {
    return (
      <div className="text-center p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium text-gray-700">No products purchased yet</h3>
        <p className="text-gray-500 mt-2">When you purchase products, they will appear here for you to review.</p>
        <Link to="/products" className="mt-4 inline-block px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
          Browse Products
        </Link>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Your Purchased Products</h2>
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {purchasedProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-48 overflow-hidden">
              <img
                src={product.image_url || '/images/placeholder.png'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-4">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              
              <div className="flex items-center my-2">
                {product.has_reviewed ? (
                  <div className="flex items-center">
                    <div className="flex mr-2">
                      {[...Array(5)].map((_, i) => (
                        <FaStar 
                          key={i}
                          className={`${i < product.user_rating ? 'text-yellow-400' : 'text-gray-300'} text-sm`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">You've reviewed this product</span>
                  </div>
                ) : (
                  <div>
                    <Link 
                      to={`/products/${product.id}`} 
                      className="px-4 py-2 bg-primary-600 text-white text-sm rounded hover:bg-primary-700 transition inline-block"
                    >
                      Leave a Review
                    </Link>
                  </div>
                )}
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-200">
                <Link 
                  to={`/products/${product.id}`} 
                  className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                >
                  View Product Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PurchasedProductsList; 