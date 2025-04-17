import { useLocation, Navigate } from 'react-router-dom';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { SettingsProvider } from './components/layout/SettingsContext';
import { ThemeProvider } from './components/layout/ThemeContext';
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
import BulkImport from './pages/Admin/BulkImport';
import ProductForm from './pages/Admin/Products/ProductForm';
import OrderDetail from './pages/Admin/OrderDetail';
import UserOrderDetail from './pages/Profile/OrderDetail';
import PolicyPage from './pages/PolicyPage';
import NotFound from './pages/NotFound';
import Debug from './pages/Debug';
import ThemeDemo from './components/ThemeDemo';

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

// Create router with direct route objects instead of JSX syntax
const router = createBrowserRouter([
  // Auth routes without header and footer
  { path: "login", element: <Login /> },
  { path: "register", element: <Register /> },
  
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "products", element: <Products /> },
      { path: "products/:id", element: <ProductDetail /> },
      { path: "product/:id", element: <ProductDetail /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "debug", element: <Debug /> },
      { path: "theme", element: <ThemeDemo /> },
      
      // Policy Pages
      { path: "privacy-policy", element: <PolicyPage type="privacy" /> },
      { path: "terms-conditions", element: <PolicyPage type="terms" /> },
      { path: "shipping-policy", element: <PolicyPage type="shipping" /> },
      { path: "sitemap", element: <PolicyPage type="sitemap" /> },
      
      // Protected Routes - wrapped with ProtectedRoute element
      {
        element: <ProtectedRoute />,
        children: [
          { path: "profile", element: <Profile /> },
          { path: "profile/edit", element: <EditProfile /> },
          { path: "profile/change-password", element: <ChangePassword /> },
          { path: "orders", element: <AdminOrders /> },
          { path: "account/orders/:id", element: <UserOrderDetail /> },
          { path: "orders/:id", element: <UserOrderDetail /> },
          { path: "cart", element: <Cart /> },
          { path: "checkout", element: <Checkout /> },
          { path: "order-confirmation/:orderId", element: <OrderConfirmation /> }
        ]
      },
      
      // 404 catch-all
      { path: "*", element: <NotFound /> }
    ]
  },
  
  // Dashboard Layout - Admin and Seller only
  {
    path: "/dashboard",
    element: <ProtectedRoute allowedRoles={['admin', 'seller']} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "products", element: <AdminProducts /> },
          { path: "products/new", element: <ProductForm /> },
          { path: "products/edit/:id", element: <ProductForm /> },
          { path: "categories", element: <AdminCategories /> },
          { path: "orders", element: <AdminOrders /> },
          { path: "orders/:id", element: <OrderDetail /> },
          
          // Admin Only Routes
          {
            element: <ProtectedRoute allowedRoles={['admin']} />,
            children: [
              { path: "users", element: <AdminUsers /> },
              { path: "bulk-import", element: <BulkImport /> }
            ]
          },
          
          { path: "settings", element: <AdminSettings /> }
        ]
      }
    ]
  },
  
  // Redirect legacy /admin/* routes to /dashboard/* for backward compatibility
  { path: "/admin", element: <Navigate to="/dashboard" replace /> },
  { path: "/admin/orders", element: <Navigate to="/dashboard/orders" replace /> },
  { path: "/admin/products", element: <Navigate to="/dashboard/products" replace /> },
  { path: "/admin/categories", element: <Navigate to="/dashboard/categories" replace /> },
  { path: "/admin/users", element: <Navigate to="/dashboard/users" replace /> },
  { path: "/admin/dashboard", element: <Navigate to="/dashboard" replace /> },
  
  // Direct access routes for admin orders
  {
    path: "/admin/orders/:id",
    element: <ProtectedRoute allowedRoles={['admin', 'seller']} />,
    children: [
      { index: true, element: <OrderDetail /> }
    ]
  },
  
  // Redirect /seller/* routes to appropriate dashboard sections
  {
    path: "/seller/products",
    element: <ProtectedRoute allowedRoles={['seller']} />,
    children: [
      { index: true, element: <Navigate to="/dashboard/products" replace /> }
    ]
  }
]);

function App() {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <RouterProvider router={router} />
        <ToastContainer position="top-right" autoClose={3000} />
      </SettingsProvider>
    </ThemeProvider>
  );
}

export default App;
