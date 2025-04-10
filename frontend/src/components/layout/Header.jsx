import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaShoppingCart, FaUserAlt, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import { logout } from '../../features/auth/authSlice';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  
  const onLogout = () => {
    dispatch(logout());
    navigate('/');
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${searchTerm}`);
      setSearchTerm('');
      setIsMenuOpen(false);
    }
  };
  
  return (
    <header className="bg-primary-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold flex items-center">
            <span className="text-white">Care</span>
            <span className="text-secondary-400">Zone</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link to="/" className="hover:text-secondary-400 transition duration-300">
              Home
            </Link>
            <Link to="/products" className="hover:text-secondary-400 transition duration-300">
              Products
            </Link>
            <Link to="/about" className="hover:text-secondary-400 transition duration-300">
              About
            </Link>
            <Link to="/contact" className="hover:text-secondary-400 transition duration-300">
              Contact
            </Link>
          </nav>
          
          {/* Search Bar */}
          <div className="hidden md:block flex-1 mx-4">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 rounded-l text-gray-800 focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                type="submit"
                className="bg-secondary-600 text-white px-4 py-2 rounded-r hover:bg-secondary-700 transition duration-300"
              >
                <FaSearch />
              </button>
            </form>
          </div>
          
          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/cart" className="hover:text-secondary-400 transition duration-300 relative">
              <FaShoppingCart className="text-xl" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>
            
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-1 hover:text-secondary-400 transition duration-300">
                  <FaUserAlt className="text-xl" />
                  <span className="hidden lg:inline-block">{user.data?.name || 'Account'}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    My Orders
                  </Link>
                  {user.data?.role === 'seller' || user.data?.role === 'admin' ? (
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Dashboard
                    </Link>
                  ) : null}
                  <button
                    onClick={onLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link to="/login" className="hover:text-secondary-400 transition duration-300 flex items-center space-x-1">
                  <FaSignInAlt className="text-xl" />
                  <span className="hidden lg:inline-block">Login</span>
                </Link>
                <Link to="/register" className="hover:text-secondary-400 transition duration-300 flex items-center space-x-1">
                  <FaUserPlus className="text-xl" />
                  <span className="hidden lg:inline-block">Register</span>
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4">
            <form onSubmit={handleSearch} className="flex mb-4">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 rounded-l text-gray-800 focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                type="submit"
                className="bg-secondary-600 text-white px-4 py-2 rounded-r hover:bg-secondary-700 transition duration-300"
              >
                <FaSearch />
              </button>
            </form>
            
            <nav className="flex flex-col space-y-3 pb-3 border-b border-primary-700">
              <Link 
                to="/" 
                className="hover:text-secondary-400 transition duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/products" 
                className="hover:text-secondary-400 transition duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link 
                to="/about" 
                className="hover:text-secondary-400 transition duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className="hover:text-secondary-400 transition duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </nav>
            
            <div className="flex flex-col space-y-3 pt-3">
              <Link 
                to="/cart" 
                className="hover:text-secondary-400 transition duration-300 flex items-center space-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <FaShoppingCart />
                <span>Cart {cartItems.length > 0 && `(${cartItems.length})`}</span>
              </Link>
              
              {user ? (
                <>
                  <Link 
                    to="/profile" 
                    className="hover:text-secondary-400 transition duration-300 flex items-center space-x-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaUserAlt />
                    <span>My Profile</span>
                  </Link>
                  <Link 
                    to="/orders" 
                    className="hover:text-secondary-400 transition duration-300 flex items-center space-x-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaUserAlt />
                    <span>My Orders</span>
                  </Link>
                  {user.data?.role === 'seller' || user.data?.role === 'admin' ? (
                    <Link 
                      to="/dashboard" 
                      className="hover:text-secondary-400 transition duration-300 flex items-center space-x-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FaUserAlt />
                      <span>Dashboard</span>
                    </Link>
                  ) : null}
                  <button 
                    onClick={() => {
                      onLogout();
                      setIsMenuOpen(false);
                    }}
                    className="hover:text-secondary-400 transition duration-300 flex items-center space-x-2 text-left"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="hover:text-secondary-400 transition duration-300 flex items-center space-x-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaSignInAlt />
                    <span>Login</span>
                  </Link>
                  <Link 
                    to="/register" 
                    className="hover:text-secondary-400 transition duration-300 flex items-center space-x-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaUserPlus />
                    <span>Register</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 