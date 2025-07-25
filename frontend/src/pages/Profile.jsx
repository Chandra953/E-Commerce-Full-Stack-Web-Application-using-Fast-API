import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8000/users/me', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load profile');
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleUpgradeToAdmin = async () => {
    try {
      const res = await fetch('http://localhost:8000/users/upgrade', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      if (!res.ok) throw new Error('Failed to upgrade');
      const data = await res.json();
      setUser({ ...user, role: 'admin' });
      alert('You are now an admin! Please log in again.');
      localStorage.removeItem('token');
      setTimeout(() => {
        navigate('/login');
      }, 1000)
    } catch {
      alert('Failed to upgrade to admin');
    }
  };


  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  if (error) return (
    <div className="rounded-md bg-red-50 p-4 my-4">
      <div className="flex">
        <div className="text-sm text-red-700">{error}</div>
      </div>
    </div>
  );

  return (
    <div className="container py-4">
      <div className="card mx-auto" style={{ maxWidth: 500 }}>
        <div className="card-body">
          <h4 className="card-title mb-3">Profile</h4>
          <ul className="list-group list-group-flush mb-3">
            <li className="list-group-item d-flex justify-content-between">
              <span className="fw-bold">Full name:</span>
              <span>{user?.name}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between">
              <span className="fw-bold">Email:</span>
              <span>{user?.email}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between">
              <span className="fw-bold">Member since:</span>
              <span>{new Date(user?.created_at).toLocaleDateString()}</span>
            </li>
          </ul>
          <div className="d-flex gap-2 justify-content-end">
            {user?.role !== 'admin' && (
              <button type="button" className="btn btn-warning" onClick={handleUpgradeToAdmin}>
                Upgrade to Admin
              </button>
            )}
            <button type="button" className="btn btn-secondary" onClick={() => {/* TODO: Change password */}}>
              Change Password
            </button>
            <button type="button" className="btn btn-danger" onClick={handleLogout}>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
