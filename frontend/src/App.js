import { Route, createRoutesFromElements, useLocation, Navigate } from 'react-router-dom';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import EditProfile from './pages/Profile/EditProfile';
import ChangePassword from './pages/Profile/ChangePassword';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import About from './pages/About';
import Contact from './pages/Contact';
import ProtectedRoute from './components/routing/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import AdminProducts from './pages/Admin/Products';
import AdminOrders from './pages/Admin/Orders';
import AdminUsers from './pages/Admin/Users';
import AdminSettings from './pages/Admin/Settings';
import AdminCategories from './pages/Admin/Categories';
import ProductForm from './pages/Admin/Products/ProductForm';
import OrderDetail from './pages/Admin/OrderDetail';
import UserOrderDetail from './pages/Profile/OrderDetail';

// Add this component somewhere after the other imports at the top
const Debug = () => {
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Debug Info</h1>
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">User Data in localStorage:</h2>
        <pre className="bg-white p-2 rounded border border-gray-300 overflow-x-auto">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
    </div>
  );
};

// Layout component with header and footer
const Layout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className={`flex-grow ${!isHomePage ? 'pt-16' : ''}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

// Create router with future flags enabled
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      {/* Main Layout Routes */}
      <Route element={<Layout />}>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/debug" element={<Debug />} />
        
        {/* Protected Routes - Any user */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/profile/change-password" element={<ChangePassword />} />
          <Route path="/orders" element={<AdminOrders />} />
          <Route path="/account/orders/:id" element={<UserOrderDetail />} />
          <Route path="/orders/:id" element={<UserOrderDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
        </Route>
      </Route>
      
      {/* Dashboard Layout - Admin and Seller only */}
      <Route element={<ProtectedRoute allowedRoles={['admin', 'seller']} />}>
        <Route element={<DashboardLayout />} path="/dashboard">
          <Route index element={<Dashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/new" element={<ProductForm />} />
          <Route path="products/edit/:id" element={<ProductForm />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="orders/:id" element={<OrderDetail />} />
          
          {/* Admin Only Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="users" element={<AdminUsers />} />
          </Route>
          
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Route>
      
      {/* Redirect legacy /admin/* routes to /dashboard/* for backward compatibility */}
      <Route path="/admin" element={<Navigate to="/dashboard" replace />} />
      <Route path="/admin/orders" element={<Navigate to="/dashboard/orders" replace />} />
      <Route path="/admin/products" element={<Navigate to="/dashboard/products" replace />} />
      <Route path="/admin/categories" element={<Navigate to="/dashboard/categories" replace />} />
      <Route path="/admin/users" element={<Navigate to="/dashboard/users" replace />} />
      <Route path="/admin/dashboard" element={<Navigate to="/dashboard" replace />} />
      
      {/* Direct access routes for admin orders */}
      <Route element={<ProtectedRoute allowedRoles={['admin', 'seller']} />}>
        <Route path="/admin/orders/:id" element={<OrderDetail />} />
      </Route>
      
      {/* Redirect /seller/* routes to appropriate dashboard sections */}
      <Route path="/seller/products" element={
        <ProtectedRoute allowedRoles={['seller']}>
          <Navigate to="/dashboard/products" replace />
        </ProtectedRoute>
      } />
    </Route>
  ),
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }
  }
);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
