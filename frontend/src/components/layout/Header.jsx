import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaShoppingCart, FaUserAlt, FaSignInAlt, FaUserPlus, FaSearch, FaBars, FaTimes, FaCar } from 'react-icons/fa';
import { logout } from '../../features/auth/authSlice';
import ThemeToggle from '../ThemeToggle';


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
  const isProductsPage = location.pathname === '/products';
  
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
      className={`${isProductsPage ? 'absolute' : 'fixed'} top-0 left-0 right-0 z-30 transition-all duration-300 ${
        isHomePage && !scrolled 
          ? 'bg-transparent backdrop-blur-0' 
          : scrolled 
            ? 'bg-primary-600/95 backdrop-blur-md shadow-lg' 
            : 'bg-primary-600/80 backdrop-blur-sm'
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
              <FaCar className="text-highlight-500 text-3xl transition-transform duration-300 group-hover:scale-110" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-highlight-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="flex items-baseline">
              <span className="text-white font-extrabold tracking-tight font-poppins">Car</span>
              <span className="text-highlight-500 font-extrabold tracking-tight font-poppins">Zone</span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`${
                location.pathname === '/'
                  ? 'text-white relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-highlight-500'
                  : 'text-gray-100 hover:text-white relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-highlight-500 hover:after:w-full after:transition-all after:duration-300'
              } px-3 py-2 text-sm font-medium transition duration-300`}
              aria-current={location.pathname === '/' ? 'page' : undefined}
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className={`${
                location.pathname === '/products'
                  ? 'text-white relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-highlight-500'
                  : 'text-gray-100 hover:text-white relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-highlight-500 hover:after:w-full after:transition-all after:duration-300'
              } px-3 py-2 text-sm font-medium transition duration-300`}
              aria-current={location.pathname === '/products' ? 'page' : undefined}
            >
              Products
            </Link>
            <Link 
              to="/about" 
              className={`${
                location.pathname === '/about'
                  ? 'text-white relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-highlight-500'
                  : 'text-gray-100 hover:text-white relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-highlight-500 hover:after:w-full after:transition-all after:duration-300'
              } px-3 py-2 text-sm font-medium transition duration-300`}
              aria-current={location.pathname === '/about' ? 'page' : undefined}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={`${
                location.pathname === '/contact'
                  ? 'text-white relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-highlight-500'
                  : 'text-gray-100 hover:text-white relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-highlight-500 hover:after:w-full after:transition-all after:duration-300'
              } px-3 py-2 text-sm font-medium transition duration-300`}
              aria-current={location.pathname === '/contact' ? 'page' : undefined}
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
                className="w-full px-4 py-2 rounded-full text-slate-800 focus:outline-none border-2 border-transparent focus:border-highlight-500 transition-all duration-300 pr-10 shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-0 top-0 bottom-0 flex items-center justify-center w-10 text-primary-600 hover:text-highlight-500 transition-colors duration-300 focus:outline-none"
              >
                <FaSearch />
              </button>
            </form>
          </div>
          
          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-5">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {user && (
              <div className="relative">
                <Link to="/cart" className="relative group">
                  <FaShoppingCart className="text-xl text-white hover:text-highlight-500 transition-colors duration-300" />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-highlight-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110">
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
                  className="flex items-center space-x-2 hover:text-highlight-500 transition-all duration-300 group"
                  onClick={toggleDropdown}
                >
                  <div className="w-9 h-9 rounded-full bg-primary-700 flex items-center justify-center overflow-hidden border-2 border-transparent group-hover:border-highlight-500 transition-all duration-300">
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
                    className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-card py-2 z-10 border border-gray-200 transform transition-all duration-300 opacity-100 scale-100"
                    style={{transformOrigin: 'top right'}}
                  >
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-slate-800">{user.data?.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.data?.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-slate-700 hover:text-highlight-500 border-l-2 border-transparent hover:border-l-2 hover:border-highlight-500 hover:bg-highlight-500/5 transition-all duration-300"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <span className="mr-2">👤</span> My Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="flex items-center px-4 py-2 text-sm text-slate-700 hover:text-highlight-500 border-l-2 border-transparent hover:border-l-2 hover:border-highlight-500 hover:bg-highlight-500/5 transition-all duration-300"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <span className="mr-2">📦</span> My Orders
                    </Link>
                    {user.data?.role === 'seller' || user.data?.role === 'admin' ? (
                      <Link
                        to="/dashboard"
                        className="flex items-center px-4 py-2 text-sm text-slate-700 hover:text-highlight-500 border-l-2 border-transparent hover:border-l-2 hover:border-highlight-500 hover:bg-highlight-500/5 transition-all duration-300"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <span className="mr-2">📊</span> Dashboard
                      </Link>
                    ) : null}
                    <button
                      onClick={onLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-slate-700 hover:text-highlight-500 border-l-2 border-transparent hover:border-l-2 hover:border-highlight-500 hover:bg-highlight-500/5 transition-all duration-300 border-t border-gray-200"
                    >
                      <span className="mr-2">🚪</span> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="text-white border border-transparent hover:border-highlight-500 transition-all duration-300 flex items-center space-x-1 px-3 py-1.5 rounded-md relative overflow-hidden group">
                  <FaSignInAlt className="text-lg z-10" />
                  <span className="hidden lg:inline-block z-10">Login</span>
                  <span className="absolute inset-0 w-0 bg-highlight-500/10 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link to="/register" className="text-white border border-highlight-500 hover:bg-highlight-500/10 transition-all duration-300 px-4 py-1.5 rounded-md flex items-center space-x-1 shadow-sm hover:shadow-md">
                  <FaUserPlus className="text-lg" />
                  <span className="hidden lg:inline-block">Register</span>
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white focus:outline-none p-1.5 rounded-md border border-transparent hover:border-highlight-500 transition-all duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <FaTimes className="text-2xl" />
            ) : (
              <FaBars className="text-2xl" />
            )}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white backdrop-blur-md shadow-lg border-t border-gray-200 transition-all duration-300 transform translate-y-0 z-20">
            <div className="px-4 py-5 space-y-4">
              <form onSubmit={handleSearch} className="flex relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full px-4 py-2 rounded-full text-slate-800 focus:outline-none border-2 border-transparent focus:border-highlight-500 transition-all duration-300 pr-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 bottom-0 flex items-center justify-center w-10 text-primary-600 hover:text-highlight-500 transition-colors duration-300"
                >
                  <FaSearch />
                </button>
              </form>
              
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-500">Theme</h3>
                <ThemeToggle />
              </div>
              
              <nav className="flex flex-col space-y-3">
                <Link 
                  to="/" 
                  className={`${
                    location.pathname === '/'
                      ? 'text-slate-800 relative border-l-4 border-highlight-500 pl-2 font-medium'
                      : 'text-slate-800 hover:border-l-4 hover:border-highlight-500 hover:pl-2 border-l-4 border-transparent pl-2'
                  } py-2 transition-all duration-300 flex items-center`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  to="/products" 
                  className={`${
                    location.pathname === '/products'
                      ? 'text-slate-800 relative border-l-4 border-highlight-500 pl-2 font-medium'
                      : 'text-slate-800 hover:border-l-4 hover:border-highlight-500 hover:pl-2 border-l-4 border-transparent pl-2'
                  } py-2 transition-all duration-300 flex items-center`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Products
                </Link>
                <Link 
                  to="/about" 
                  className={`${
                    location.pathname === '/about'
                      ? 'text-slate-800 relative border-l-4 border-highlight-500 pl-2 font-medium'
                      : 'text-slate-800 hover:border-l-4 hover:border-highlight-500 hover:pl-2 border-l-4 border-transparent pl-2'
                  } py-2 transition-all duration-300 flex items-center`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
                <Link 
                  to="/contact" 
                  className={`${
                    location.pathname === '/contact'
                      ? 'text-slate-800 relative border-l-4 border-highlight-500 pl-2 font-medium'
                      : 'text-slate-800 hover:border-l-4 hover:border-highlight-500 hover:pl-2 border-l-4 border-transparent pl-2'
                  } py-2 transition-all duration-300 flex items-center`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
              </nav>
              
              <div className="pt-3 border-t border-gray-200">
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
                          <div className="font-medium text-slate-800">{user.data?.name}</div>
                          <div className="text-xs text-slate-500">{user.data?.email}</div>
                        </div>
                      </div>
                      <Link to="/cart" className="relative">
                        <FaShoppingCart className="text-xl text-highlight-500" />
                        {cartItems.length > 0 && (
                          <span className="absolute -top-2 -right-2 bg-highlight-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                            {cartItems.length}
                          </span>
                        )}
                      </Link>
                    </div>
                    
                    <div className="space-y-1">
                      <Link
                        to="/profile"
                        className="block w-full text-left px-3 py-2 rounded-md text-slate-700 hover:text-highlight-500 hover:bg-highlight-500/5 border-l-2 border-transparent hover:border-l-2 hover:border-highlight-500 pl-3 hover:pl-4 transition-all duration-300"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        My Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="block w-full text-left px-3 py-2 rounded-md text-slate-700 hover:text-highlight-500 hover:bg-highlight-500/5 border-l-2 border-transparent hover:border-l-2 hover:border-highlight-500 pl-3 hover:pl-4 transition-all duration-300"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        My Orders
                      </Link>
                      {user.data?.role === 'seller' || user.data?.role === 'admin' ? (
                        <Link
                          to="/dashboard"
                          className="block w-full text-left px-3 py-2 rounded-md text-slate-700 hover:text-highlight-500 hover:bg-highlight-500/5 border-l-2 border-transparent hover:border-l-2 hover:border-highlight-500 pl-3 hover:pl-4 transition-all duration-300"
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
                        className="block w-full text-left px-3 py-2 rounded-md text-slate-700 hover:text-highlight-500 hover:bg-highlight-500/5 border-l-2 border-transparent hover:border-l-2 hover:border-highlight-500 pl-3 hover:pl-4 transition-all duration-300 mt-2"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Link 
                      to="/login" 
                      className="block w-full text-center px-4 py-2 text-slate-700 border border-gray-200 hover:border-highlight-500 hover:text-highlight-500 rounded-md transition-all duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FaSignInAlt className="inline-block mr-2" />
                      Login
                    </Link>
                    <Link 
                      to="/register" 
                      className="block w-full text-center px-4 py-2 text-white bg-transparent border border-highlight-500 bg-highlight-500 hover:bg-transparent hover:text-highlight-500 rounded-md transition-all duration-300"
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