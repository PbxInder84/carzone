import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  FaTachometerAlt, 
  FaUsers, 
  FaShoppingCart, 
  FaCar, 
  FaCog, 
  FaBars, 
  FaTimes, 
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronDown,
  FaChevronRight
} from 'react-icons/fa';
import { logout } from '../../features/auth/authSlice';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };
  
  // Navigation items
  const navItems = [
    {
      label: 'Dashboard',
      icon: <FaTachometerAlt />,
      path: '/dashboard',
      roles: ['admin', 'seller']
    },
    {
      label: 'Products',
      icon: <FaCar />,
      path: '/dashboard/products',
      roles: ['admin', 'seller']
    },
    {
      label: 'Orders',
      icon: <FaShoppingCart />,
      path: '/dashboard/orders',
      roles: ['admin', 'seller']
    },
    {
      label: 'Users',
      icon: <FaUsers />,
      path: '/dashboard/users',
      roles: ['admin']
    },
    {
      label: 'Settings',
      icon: <FaCog />,
      path: '/dashboard/settings',
      roles: ['admin', 'seller']
    }
  ];
  
  // Filter nav items based on user role
  const filteredNavItems = navItems.filter(item => {
    return user?.data?.role && item.roles.includes(user.data.role);
  });
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Desktop */}
      <aside 
        className={`hidden md:flex flex-col bg-primary-800 text-white transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-primary-700">
          {sidebarOpen ? (
            <Link to="/" className="flex items-center space-x-2">
              <FaCar className="text-secondary-400 text-2xl" />
              <span className="text-xl font-bold">CarZone</span>
            </Link>
          ) : (
            <Link to="/" className="mx-auto">
              <FaCar className="text-secondary-400 text-2xl" />
            </Link>
          )}
          <button 
            onClick={toggleSidebar}
            className="text-white hover:text-secondary-400 focus:outline-none"
          >
            {sidebarOpen ? <FaChevronLeft /> : <FaChevronRight />}
          </button>
        </div>
        
        {/* Sidebar Navigation */}
        <nav className="flex-grow py-4">
          <ul className="space-y-1">
            {filteredNavItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => 
                    `flex items-center py-3 px-4 transition-colors ${
                      isActive 
                        ? 'bg-primary-700 text-secondary-400' 
                        : 'text-white hover:bg-primary-700'
                    }`
                  }
                >
                  <span className="text-lg">{item.icon}</span>
                  {sidebarOpen && <span className="ml-3">{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Sidebar Footer */}
        <div className="p-4 border-t border-primary-700">
          {sidebarOpen ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-primary-700 flex items-center justify-center">
                  <FaUsers className="text-secondary-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{user?.data?.name || 'User'}</p>
                  <p className="text-xs text-gray-400 capitalize">{user?.data?.role || 'role'}</p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="text-white hover:text-secondary-400"
                title="Logout"
              >
                <FaSignOutAlt />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <div className="h-8 w-8 rounded-full bg-primary-700 flex items-center justify-center">
                <FaUsers className="text-secondary-400" />
              </div>
              <button 
                onClick={handleLogout}
                className="text-white hover:text-secondary-400"
                title="Logout"
              >
                <FaSignOutAlt />
              </button>
            </div>
          )}
        </div>
      </aside>
      
      {/* Mobile Sidebar Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}
      
      {/* Sidebar - Mobile */}
      <aside 
        className={`fixed md:hidden inset-y-0 left-0 z-30 w-64 bg-primary-800 text-white transform ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-primary-700">
          <Link to="/" className="flex items-center space-x-2">
            <FaCar className="text-secondary-400 text-2xl" />
            <span className="text-xl font-bold">CarZone</span>
          </Link>
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="text-white hover:text-secondary-400 focus:outline-none"
          >
            <FaTimes />
          </button>
        </div>
        
        {/* Sidebar Navigation */}
        <nav className="flex-grow py-4">
          <ul className="space-y-1">
            {filteredNavItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => 
                    `flex items-center py-3 px-4 transition-colors ${
                      isActive 
                        ? 'bg-primary-700 text-secondary-400' 
                        : 'text-white hover:bg-primary-700'
                    }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="ml-3">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Sidebar Footer */}
        <div className="p-4 border-t border-primary-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-primary-700 flex items-center justify-center">
                <FaUsers className="text-secondary-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{user?.data?.name || 'User'}</p>
                <p className="text-xs text-gray-400 capitalize">{user?.data?.role || 'role'}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="text-white hover:text-secondary-400"
              title="Logout"
            >
              <FaSignOutAlt />
            </button>
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm">
          <div className="px-4 py-4 flex items-center justify-between">
            <div className="flex items-center">
              {/* Mobile Menu Toggle */}
              <button 
                className="md:hidden mr-4 text-gray-600 hover:text-primary-600 focus:outline-none"
                onClick={() => setMobileMenuOpen(true)}
              >
                <FaBars className="text-xl" />
              </button>
              
              <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link 
                to="/"
                className="text-sm flex items-center text-primary-600 hover:text-primary-800"
              >
                <span>Back to site</span>
                <FaChevronRight className="ml-1" />
              </Link>
            </div>
          </div>
        </header>
        
        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 