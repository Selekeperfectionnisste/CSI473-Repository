// AdminLogin.js 
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  // Hardcoded admin credentials
  const ADMIN_CREDENTIALS = {
    username: 'AD790',
    password: 'NWA7675'
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic validation
    if (!formData.username || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    // Check against hardcoded credentials
    if (formData.username === ADMIN_CREDENTIALS.username && 
        formData.password === ADMIN_CREDENTIALS.password) {
      
      // Store admin authentication in localStorage
      localStorage.setItem('adminAuthenticated', 'true');
      localStorage.setItem('userType', 'admin');
      localStorage.setItem('user', JSON.stringify({
        username: 'AD790',
        user_type: 'admin',
        role: 'Administrator'
      }));

      console.log('🟢 Admin login successful');
      
      // Small delay to show success state
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1000);
      
    } else {
      setError('Invalid admin credentials');
    }

    setLoading(false);
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-brand">
            <span className="admin-icon">🔐</span>
            <span className="admin-brand-text">NeighborhoodWatch</span>
          </div>
          <h2>Admin Access</h2>
          <p>Restricted area - Authorized personnel only</p>
        </div>
        
        {error && (
          <div className="admin-alert error">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label htmlFor="username">Admin Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Enter admin username"
              className="admin-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Admin Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Enter admin password"
              className="admin-input"
            />
          </div>
          
          <button 
            type="submit" 
            className={`admin-login-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="admin-spinner"></div>
                Authenticating...
              </>
            ) : (
              'Access Admin Dashboard'
            )}
          </button>
        </form>

        <div className="admin-login-links">
          <button 
            onClick={() => navigate('/login')} 
            className="back-to-user-login"
          >
            ← Go to User Login
          </button>
        </div>

        <div className="admin-note">
          <p><strong>Note:</strong> This is a restricted administrative interface only administrators can access it</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;