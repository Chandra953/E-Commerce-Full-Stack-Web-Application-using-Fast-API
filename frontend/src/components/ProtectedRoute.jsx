import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { getToken } from '../utils/auth';

export default function ProtectedRoute({ children, admin = false }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const token = getToken();

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    // Check user role if admin route
    if (admin) {
      fetch('http://localhost:8000/users/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          setIsAdmin(data.role === 'admin');
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [token, admin]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (admin && !isAdmin) {
    return <Navigate to="/admin/products" />;
  }

  return children;
}
