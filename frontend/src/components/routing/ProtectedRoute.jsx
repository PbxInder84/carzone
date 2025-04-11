import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Spinner from '../layout/Spinner';

// Protected route component to restrict access to authenticated users
const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, isLoading } = useSelector((state) => state.auth);
  
  // Show loading spinner while checking authentication status
  if (isLoading) {
    return <Spinner />;
  }
  
  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // If roles are specified and user doesn't have one of the required roles, redirect
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.data?.role)) {
    return <Navigate to="/" replace />;
  }
  
  // If authenticated and has permission, render the child routes
  return <Outlet />;
};

export default ProtectedRoute; 