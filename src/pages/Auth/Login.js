import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();

  // Check URL parameters for messages
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    
    if (searchParams.get('registered') === 'true') {
      setSuccess('Registration successful! Please verify your email before logging in.');
    }
    
    if (searchParams.get('reset') === 'true') {
      setSuccess('Password reset successfully! You can now login with your new password.');
    }

    // Check for state message from VerifySuccess page
    if (window.history.state && window.history.state.usr && window.history.state.usr.message) {
      setSuccess(window.history.state.usr.message);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      const result = await authService.login(formData.email, formData.password);
      
     const debugStorage = () => {
  console.log('🔍 DEBUG STORAGE:');
  console.log('user:', localStorage.getItem('user'));
  console.log('userType:', localStorage.getItem('userType'));
  console.log('token:', localStorage.getItem('token'));
};
// In Login.js handleSubmit function - FIXED VERSION:
if (result.success) {
  setSuccess('Login successful! Redirecting...');
  
  console.log('🟢 Login successful, user data:', result.user);
  console.log('🟢 Full result object:', result);
  
  // Small delay to show success message
  setTimeout(() => {
    // FIX: Get user type from multiple possible sources
    let userType = result.user?.user_type || // From user object (PHP response)
                   result.userType ||        // From result directly (authService)
                   localStorage.getItem('userType'); // From localStorage
    
    console.log('🟢 User type determined:', userType);
    
    // If still no user type, try to get from stored user data
    if (!userType) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          userType = parsedUser.user_type;
          console.log('🟢 User type from localStorage:', userType);
        } catch (e) {
          console.error('Error parsing stored user:', e);
        }
      }
    }
    
    // Redirect based on user type
    if (userType) {
      console.log('🟢 Redirecting based on user type:', userType);
      switch(userType.toLowerCase()) {
        case 'admin':
          console.log('Redirecting to admin dashboard');
          navigate('/admin/dashboard');
          break;
        case 'security':
          console.log('Redirecting to security dashboard');
          navigate('/security_dashboard');
          break;
        case 'member':
          console.log('Redirecting to member dashboard');
          navigate('/member_dashboard');
          break;
        default:
          console.log('Unknown user type, redirecting to default');
          navigate('/login');
      }
    } else {
      console.log('❌ No user type found, using redirectTo:', result.redirectTo);
      // Use the redirect_to from PHP response as fallback
      if (result.redirectTo) {
        navigate(result.redirectTo);
      } else {
        navigate('/member-dashboard');
      }
    }
  }, 1500);
} else {
  setError(result.message);

        
        // If it's an email verification error, offer to resend
        if (result.message && result.message.includes('verify your email')) {
          setError(
            <span>
              {result.message}{' '}
              <button 
                type="button" 
                className="resend-link"
                onClick={handleResendVerification}
              >
                Resend verification email
              </button>
            </span>
          );
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password first');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Try to sign in to get current user
      await authService.login(formData.email, formData.password);
      const result = await authService.resendVerificationEmail();
      if (result.success) {
        setSuccess('Verification email sent! Please check your inbox.');
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Failed to resend verification email. Please try registering again.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-brand">
            <span className="brand-icon">🏠</span>
            <span className="brand-text">NeighborhoodWatch</span>
          </div>
          <h2>Welcome Back</h2>
          <p>Sign in to your account</p>
        </div>
        
        {error && (
          <div className="alert error">
            {typeof error === 'string' ? error : error}
          </div>
        )}
        {success && <div className="alert success">{success}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group password-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                disabled={loading}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div className="form-options">
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <Link to="/forgot-password" className="forgot-password-link">
              Forgot password?
            </Link>
          </div>
          
          <button 
            type="submit" 
            className={`auth-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        
        <div className="auth-links">
          <div className="auth-signup">
            Don't have an account? <Link to="/register" className="auth-link signup">Sign up</Link>
          </div>
          <Link to="/" className="auth-link home">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;