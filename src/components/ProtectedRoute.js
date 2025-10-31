import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { auth } from '../config/firebase';

const ProtectedRoute = ({ children, requiredRole }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
    
    // Set up auth state listener for real-time updates
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        await loadUserData(firebaseUser);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

  const loadUserData = async (firebaseUser) => {
    try {
      const userData = await authService.getCurrentUser();
      if (userData) {
        setUser({
          ...userData,
          isAuthenticated: true,
          emailVerified: firebaseUser.emailVerified
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const checkAuthStatus = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        await loadUserData(currentUser);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner">Loading...</div>
      </div>
    );
  }

  if (!user || !user.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check email verification
  if (!user.emailVerified) {
    return <Navigate to="/login" replace />;
  }

  // Check user role if required
  if (requiredRole && user.userType !== requiredRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;