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
  FaChevronRight,
  FaTags,
  FaFileImport
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
      label: 'Categories',
      icon: <FaTags />,
      path: '/dashboard/categories',
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
      label: 'Bulk Import',
      icon: <FaFileImport />,
      path: '/dashboard/bulk-import',
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
    <div className="flex h-screen bg-background">
      {/* Sidebar - Desktop */}
      <aside 
        className={`hidden md:flex flex-col bg-slate-800 text-white transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          {sidebarOpen ? (
            <Link to="/" className="flex items-center space-x-2">
              <FaCar className="text-highlight-500 text-2xl" />
              <span className="text-xl font-bold font-poppins">CarZone</span>
            </Link>
          ) : (
            <Link to="/" className="mx-auto">
              <FaCar className="text-highlight-500 text-2xl" />
            </Link>
          )}
          <button 
            onClick={toggleSidebar}
            className="text-white hover:text-highlight-500 focus:outline-none"
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
                        ? 'bg-slate-700 text-highlight-500 border-l-4 border-highlight-500' 
                        : 'text-white hover:bg-slate-700 border-l-4 border-transparent'
                    }`
                  }
                >
                  <span className="text-lg">{item.icon}</span>
                  {sidebarOpen && <span className="ml-3 font-medium">{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-700">
          {sidebarOpen ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                  <FaUsers className="text-white" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{user?.data?.name || 'User'}</p>
                  <p className="text-xs text-gray-400 capitalize">{user?.data?.role || 'role'}</p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="text-white hover:text-highlight-500 transition-colors"
                title="Logout"
              >
                <FaSignOutAlt />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                <FaUsers className="text-white" />
              </div>
              <button 
                onClick={handleLogout}
                className="text-white hover:text-highlight-500 transition-colors"
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
        className={`fixed md:hidden inset-y-0 left-0 z-30 w-64 bg-slate-800 text-white transform ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <Link to="/" className="flex items-center space-x-2">
            <FaCar className="text-highlight-500 text-2xl" />
            <span className="text-xl font-bold font-poppins">CarZone</span>
          </Link>
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="text-white hover:text-highlight-500 focus:outline-none"
          >
            <FaTimes />
          </button>
        </div>
        
        {/* Sidebar Navigation for Mobile - similar styling to desktop */}
        <nav className="flex-grow py-4">
          <ul className="space-y-1">
            {filteredNavItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => 
                    `flex items-center py-3 px-4 transition-colors ${
                      isActive 
                        ? 'bg-slate-700 text-highlight-500 border-l-4 border-highlight-500' 
                        : 'text-white hover:bg-slate-700 border-l-4 border-transparent'
                    }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="ml-3 font-medium">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Mobile Sidebar Footer */}
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                <FaUsers className="text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{user?.data?.name || 'User'}</p>
                <p className="text-xs text-gray-400 capitalize">{user?.data?.role || 'role'}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="text-white hover:text-highlight-500"
              title="Logout"
            >
              <FaSignOutAlt />
            </button>
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation - Mobile Only */}
        <header className="md:hidden bg-surface shadow-sm z-10">
          <div className="flex items-center justify-between p-4">
            <button
              className="text-slate-800 hover:text-primary-600 focus:outline-none"
              onClick={() => setMobileMenuOpen(true)}
            >
              <FaBars />
            </button>
            <h1 className="text-lg font-bold text-slate-800 font-poppins">Dashboard</h1>
            <div className="w-6"></div>
          </div>
        </header>
        
        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-background p-4">
          <div className="container mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 