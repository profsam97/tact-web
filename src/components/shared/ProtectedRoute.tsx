import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useIsAuthenticated } from '@/store/authStore'; 

interface ProtectedRouteProps {
  children?: React.ReactNode; 
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useIsAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
