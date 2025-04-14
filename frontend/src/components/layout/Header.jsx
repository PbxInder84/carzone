import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaShoppingCart, FaUserAlt, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaSearch, FaBars, FaTimes, FaCar } from 'react-icons/fa';
import { logout } from '../../features/auth/authSlice';
import CartIcon from './CartIcon';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [scrolled, setScrolled] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  
  const isHomePage = location.pathname === '/';
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);
  
  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdown = document.getElementById('user-dropdown');
      const button = document.getElementById('user-dropdown-button');
      
      if (dropdown && button && 
          !dropdown.contains(event.target) && 
          !button.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const onLogout = () => {
    dispatch(logout());
    setIsDropdownOpen(false);
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

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${
        isHomePage && !scrolled 
          ? 'bg-transparent' 
          : scrolled 
            ? 'bg-primary-800 shadow-lg' 
            : 'bg-primary-800 bg-opacity-90'
      } text-white`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold flex items-center space-x-2">
            <FaCar className="text-secondary-400" />
            <div className="flex">
              <span className="text-white">Car</span>
              <span className="text-secondary-400">Zone</span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`hover:text-secondary-400 transition duration-300 ${location.pathname === '/' ? 'text-secondary-400 font-medium' : ''}`}
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className={`hover:text-secondary-400 transition duration-300 ${location.pathname === '/products' ? 'text-secondary-400 font-medium' : ''}`}
            >
              Products
            </Link>
            <Link 
              to="/about" 
              className={`hover:text-secondary-400 transition duration-300 ${location.pathname === '/about' ? 'text-secondary-400 font-medium' : ''}`}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={`hover:text-secondary-400 transition duration-300 ${location.pathname === '/contact' ? 'text-secondary-400 font-medium' : ''}`}
            >
              Contact
            </Link>
          </nav>
          
          {/* Search Bar */}
          <div className="hidden md:block flex-1 mx-6 max-w-md">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 rounded-l text-gray-800 focus:outline-none focus:ring focus:ring-secondary-300"
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
            {user && <CartIcon />}
            
            {user ? (
              <div className="relative">
                <button 
                  id="user-dropdown-button"
                  className="flex items-center space-x-1 hover:text-secondary-400 transition duration-300"
                  onClick={toggleDropdown}
                >
                  <FaUserAlt className="text-xl" />
                  <span className="hidden lg:inline-block">{user.data?.name || 'Account'}</span>
                </button>
                {isDropdownOpen && (
                  <div 
                    id="user-dropdown"
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
                  >
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary-700"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary-700"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      My Orders
                    </Link>
                    {user.data?.role === 'seller' || user.data?.role === 'admin' ? (
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary-700"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Dashboard
                      </Link>
                    ) : null}
                    <button
                      onClick={onLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary-700"
                    >
                      Logout
                    </button>
                  </div>
                )}
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
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 bg-primary-800 absolute left-0 right-0 px-4 py-3 shadow-lg">
            <form onSubmit={handleSearch} className="flex mb-4">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 rounded-l text-gray-800 focus:outline-none focus:ring focus:ring-secondary-300"
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
                className={`hover:text-secondary-400 transition duration-300 ${location.pathname === '/' ? 'text-secondary-400 font-medium' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/products" 
                className={`hover:text-secondary-400 transition duration-300 ${location.pathname === '/products' ? 'text-secondary-400 font-medium' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link 
                to="/about" 
                className={`hover:text-secondary-400 transition duration-300 ${location.pathname === '/about' ? 'text-secondary-400 font-medium' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className={`hover:text-secondary-400 transition duration-300 ${location.pathname === '/contact' ? 'text-secondary-400 font-medium' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </nav>
            
            {/* Mobile Menu Links */}
            <div className="flex flex-col space-y-3 pt-3">
              <div className="flex items-center justify-between border-b border-primary-700 pb-3">
                {user ? (
                  <>
                    <div className="flex items-center space-x-2">
                      <FaUserAlt />
                      <span>{user.data?.name || 'User'}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      {user && <CartIcon />}
                      <button onClick={onLogout} className="flex items-center space-x-1 text-red-400">
                        <FaSignOutAlt />
                        <span>Logout</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex space-x-4 w-full">
                    <Link 
                      to="/login" 
                      className="flex items-center justify-center space-x-1 bg-primary-700 hover:bg-primary-600 w-1/2 py-2 rounded transition duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FaSignInAlt />
                      <span>Login</span>
                    </Link>
                    <Link 
                      to="/register" 
                      className="flex items-center justify-center space-x-1 bg-secondary-600 hover:bg-secondary-500 w-1/2 py-2 rounded transition duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FaUserPlus />
                      <span>Register</span>
                    </Link>
                  </div>
                )}
              </div>
              
              {user && (
                <div className="space-y-3 border-b border-primary-700 pb-3">
                  <Link 
                    to="/profile" 
                    className="block hover:text-secondary-400"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  <Link 
                    to="/orders" 
                    className="block hover:text-secondary-400"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  <Link 
                    to="/cart" 
                    className="block hover:text-secondary-400"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Cart
                  </Link>
                  {user.data?.role === 'seller' || user.data?.role === 'admin' ? (
                    <Link
                      to="/dashboard"
                      className="block hover:text-secondary-400"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 