import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore.js';
import { ROUTES } from '../constants/routes.js';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    // Redirect to login if user is not authenticated
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return children;
};

export default ProtectedRoute;
