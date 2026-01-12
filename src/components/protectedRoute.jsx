// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user hasn't completed age verification (first-time users)
  if (!user.birthdate) {
    return <Navigate to="/age-verification" replace />;
  }

  return children;
};

export const KidProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (user && !user.isKid) {
    return <Navigate to="/main" replace />;
  }
  
  return children;
};

export const AdultProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (user && user.isKid) {
    return <Navigate to="/kids" replace />;
  }
  
  return children;
};