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
import Products from './pages/Products';
import About from './pages/About';
import Contact from './pages/Contact';
import ProtectedRoute from './components/routing/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import AdminProducts from './pages/Admin/Products';
import AdminOrders from './pages/Admin/Orders';
import AdminUsers from './pages/Admin/Users';
import AdminSettings from './pages/Admin/Settings';
import CategoryList from './pages/Admin/Products/CategoryList';
import CreateCategory from './pages/Admin/Products/CreateCategory';
import ProductForm from './pages/Admin/Products/ProductForm';

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
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* Protected Routes - Any user */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<Home />} />
          <Route path="/cart" element={<Home />} />
        </Route>
      </Route>
      
      {/* Dashboard Layout - Admin and Seller only */}
      <Route element={<ProtectedRoute allowedRoles={['admin', 'seller']} />}>
        <Route element={<DashboardLayout />} path="/dashboard">
          <Route index element={<Dashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/new" element={<ProductForm />} />
          <Route path="products/edit/:id" element={<ProductForm />} />
          <Route path="orders" element={<AdminOrders />} />
          
          {/* Admin Only Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="users" element={<AdminUsers />} />
            <Route path="categories" element={<CategoryList />} />
            <Route path="categories/create" element={<CreateCategory />} />
            <Route path="categories/edit/:id" element={<CreateCategory />} />
          </Route>
          
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Route>
      
      {/* Redirect legacy /admin/* routes to /dashboard/* for backward compatibility */}
      <Route path="/admin/*" element={
        <ProtectedRoute allowedRoles={['admin', 'seller']}>
          <Navigate to="/dashboard/*" replace />
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
