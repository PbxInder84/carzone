import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaShoppingCart, FaUserAlt, FaSignInAlt, FaUserPlus, FaSearch, FaBars, FaTimes, FaCar } from 'react-icons/fa';
import { logout } from '../../features/auth/authSlice';


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
          ? 'bg-transparent backdrop-blur-0' 
          : scrolled 
            ? 'bg-primary-800/95 backdrop-blur-md shadow-lg' 
            : 'bg-primary-800/80 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-2xl font-bold flex items-center space-x-2 group"
          >
            <div className="relative">
              <FaCar className="text-secondary-400 text-3xl transition-transform duration-300 group-hover:scale-110" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-secondary-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="flex items-baseline">
              <span className="text-white font-extrabold tracking-tight">Car</span>
              <span className="text-secondary-400 font-extrabold tracking-tight">Zone</span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`hover:text-secondary-400 transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-secondary-400 after:transition-all after:duration-300 ${
                location.pathname === '/' ? 'text-secondary-400 font-medium after:w-full' : 'text-white'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className={`hover:text-secondary-400 transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-secondary-400 after:transition-all after:duration-300 ${
                location.pathname === '/products' ? 'text-secondary-400 font-medium after:w-full' : 'text-white'
              }`}
            >
              Products
            </Link>
            <Link 
              to="/about" 
              className={`hover:text-secondary-400 transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-secondary-400 after:transition-all after:duration-300 ${
                location.pathname === '/about' ? 'text-secondary-400 font-medium after:w-full' : 'text-white'
              }`}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={`hover:text-secondary-400 transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-secondary-400 after:transition-all after:duration-300 ${
                location.pathname === '/contact' ? 'text-secondary-400 font-medium after:w-full' : 'text-white'
              }`}
            >
              Contact
            </Link>
          </nav>
          
          {/* Search Bar */}
          <div className="hidden md:block flex-1 mx-6 max-w-md">
            <form onSubmit={handleSearch} className="flex relative group">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 rounded-full text-gray-800 focus:outline-none border-2 border-transparent focus:border-secondary-400 transition-all duration-300 pr-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-0 top-0 bottom-0 flex items-center justify-center w-10 text-primary-600 hover:text-secondary-600 transition-colors duration-300 focus:outline-none"
              >
                <FaSearch />
              </button>
            </form>
          </div>
          
          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-5">
            {user && (
              <div className="relative">
                <Link to="/cart" className="relative group">
                  <FaShoppingCart className="text-xl text-white hover:text-secondary-400 transition-colors duration-300" />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-secondary-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110">
                      {cartItems.length}
                    </span>
                  )}
                </Link>
              </div>
            )}
            
            {user ? (
              <div className="relative">
                <button 
                  id="user-dropdown-button"
                  className="flex items-center space-x-2 hover:text-secondary-400 transition-all duration-300 group"
                  onClick={toggleDropdown}
                >
                  <div className="w-9 h-9 rounded-full bg-primary-600 flex items-center justify-center overflow-hidden border-2 border-transparent group-hover:border-secondary-400 transition-all duration-300">
                    {user.data?.name ? (
                      <span className="text-white text-lg font-semibold">
                        {user.data.name.charAt(0).toUpperCase()}
                      </span>
                    ) : (
                      <FaUserAlt className="text-lg text-white" />
                    )}
                  </div>
                </button>
                {isDropdownOpen && (
                  <div 
                    id="user-dropdown"
                    className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-10 border border-gray-100 transform transition-all duration-300 opacity-100 scale-100"
                    style={{transformOrigin: 'top right'}}
                  >
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.data?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.data?.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-700"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <span className="mr-2">👤</span> My Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-700"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <span className="mr-2">📦</span> My Orders
                    </Link>
                    {user.data?.role === 'seller' || user.data?.role === 'admin' ? (
                      <Link
                        to="/dashboard"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-700"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <span className="mr-2">📊</span> Dashboard
                      </Link>
                    ) : null}
                    <button
                      onClick={onLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600 border-t border-gray-100"
                    >
                      <span className="mr-2">🚪</span> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="hover:text-secondary-400 transition duration-300 flex items-center space-x-1 px-3 py-1 rounded-md hover:bg-primary-700/50">
                  <FaSignInAlt className="text-lg" />
                  <span className="hidden lg:inline-block">Login</span>
                </Link>
                <Link to="/register" className="text-white bg-secondary-600 hover:bg-secondary-500 transition-all duration-300 px-4 py-1.5 rounded-md flex items-center space-x-1 shadow-md hover:shadow-lg">
                  <FaUserPlus className="text-lg" />
                  <span className="hidden lg:inline-block">Register</span>
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white focus:outline-none p-1 rounded-md hover:bg-primary-700/50 transition-colors duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-primary-800/95 backdrop-blur-md shadow-lg border-t border-primary-700/50 transition-all duration-300 transform translate-y-0 z-20">
            <div className="px-4 py-5 space-y-4">
              <form onSubmit={handleSearch} className="flex relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full px-4 py-2 rounded-full text-gray-800 focus:outline-none border-2 border-transparent focus:border-secondary-400 transition-all duration-300 pr-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 bottom-0 flex items-center justify-center w-10 text-primary-600 hover:text-secondary-600 transition-colors duration-300"
                >
                  <FaSearch />
                </button>
              </form>
              
              <nav className="flex flex-col space-y-3">
                <Link 
                  to="/" 
                  className={`py-2 px-3 rounded-md transition duration-300 ${
                    location.pathname === '/' 
                      ? 'text-secondary-400 bg-primary-700/50 font-medium' 
                      : 'text-white hover:bg-primary-700/30'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  to="/products" 
                  className={`py-2 px-3 rounded-md transition duration-300 ${
                    location.pathname === '/products' 
                      ? 'text-secondary-400 bg-primary-700/50 font-medium' 
                      : 'text-white hover:bg-primary-700/30'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Products
                </Link>
                <Link 
                  to="/about" 
                  className={`py-2 px-3 rounded-md transition duration-300 ${
                    location.pathname === '/about' 
                      ? 'text-secondary-400 bg-primary-700/50 font-medium' 
                      : 'text-white hover:bg-primary-700/30'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
                <Link 
                  to="/contact" 
                  className={`py-2 px-3 rounded-md transition duration-300 ${
                    location.pathname === '/contact' 
                      ? 'text-secondary-400 bg-primary-700/50 font-medium' 
                      : 'text-white hover:bg-primary-700/30'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
              </nav>
              
              <div className="pt-3 border-t border-primary-700/50">
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center">
                          {user.data?.name ? (
                            <span className="text-white text-lg font-semibold">
                              {user.data.name.charAt(0).toUpperCase()}
                            </span>
                          ) : (
                            <FaUserAlt className="text-lg text-white" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-white">{user.data?.name}</div>
                          <div className="text-xs text-gray-300">{user.data?.email}</div>
                        </div>
                      </div>
                      <Link to="/cart" className="relative">
                        <FaShoppingCart className="text-xl text-white" />
                        {cartItems.length > 0 && (
                          <span className="absolute -top-2 -right-2 bg-secondary-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                            {cartItems.length}
                          </span>
                        )}
                      </Link>
                    </div>
                    
                    <div className="space-y-1">
                      <Link
                        to="/profile"
                        className="block w-full text-left px-3 py-2 rounded-md text-white hover:bg-primary-700/50 transition duration-300"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        My Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="block w-full text-left px-3 py-2 rounded-md text-white hover:bg-primary-700/50 transition duration-300"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        My Orders
                      </Link>
                      {user.data?.role === 'seller' || user.data?.role === 'admin' ? (
                        <Link
                          to="/dashboard"
                          className="block w-full text-left px-3 py-2 rounded-md text-white hover:bg-primary-700/50 transition duration-300"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Dashboard
                        </Link>
                      ) : null}
                      <button
                        onClick={() => {
                          onLogout();
                          setIsMenuOpen(false);
                        }}
                        className="block w-full text-left px-3 py-2 rounded-md text-white hover:bg-red-600/80 transition duration-300 mt-2"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Link 
                      to="/login" 
                      className="block w-full text-center px-4 py-2 text-white hover:bg-primary-700/50 rounded-md transition duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FaSignInAlt className="inline-block mr-2" />
                      Login
                    </Link>
                    <Link 
                      to="/register" 
                      className="block w-full text-center px-4 py-2 text-white bg-secondary-600 hover:bg-secondary-500 rounded-md transition duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FaUserPlus className="inline-block mr-2" />
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 