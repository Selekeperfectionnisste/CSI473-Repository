import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import './Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    // Email validation
    if (!email) {
      setError('Please enter your email address');
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      const result = await authService.forgotPassword(email);
      
      if (result.success) {
        setMessage(result.message);
        setEmailSent(true);
        setError('');
        
        // Auto-redirect after success
        setTimeout(() => {
          navigate('/login?reset=sent');
        }, 5000);
      } else {
        setError(result.message);
        setEmailSent(false);
      }
    } catch (error) {
      setError('Failed to send reset email. Please try again.');
      console.error('Forgot password error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError('Please enter your email address first');
      return;
    }
    
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const result = await authService.forgotPassword(email);
      
      if (result.success) {
        setMessage('Reset email sent again! Please check your inbox.');
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Failed to resend email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-brand">
            <span className="brand-icon">🏠</span>
            <span className="brand-text">NeighborhoodWatch</span>
          </div>
          <h2>Reset Your Password</h2>
          <p>Enter your email to receive password reset instructions</p>
        </div>

        {error && <div className="alert error">{error}</div>}
        {message && <div className="alert success">{message}</div>}

        {!emailSent ? (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                placeholder="Enter your registered email"
                className={error ? 'error' : ''}
              />
              <small className="hint">
                We'll send a password reset link to this email
              </small>
            </div>

            <button 
              type="submit" 
              className={`auth-button ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Sending Reset Link...
                </>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>
        ) : (
          <div className="success-state">
            <div className="success-icon">✅</div>
            <h3>Check Your Email</h3>
            <p>We've sent password reset instructions to:</p>
            <div className="sent-email">{email}</div>
            
            <div className="reset-instructions">
              <h4>What to do next:</h4>
              <ol>
                <li>Check your inbox for an email from NeighborhoodWatch</li>
                <li>Click the "Reset Password" link in the email</li>
                <li>Follow the instructions to create a new password</li>
                <li>Return here to login with your new password</li>
              </ol>
              
              <div className="email-tips">
                <strong>Didn't receive the email?</strong>
                <ul>
                  <li>Check your spam or junk folder</li>
                  <li>Verify you entered the correct email address</li>
                  <li>Wait a few minutes - emails may be delayed</li>
                </ul>
              </div>
            </div>

            <div className="action-buttons">
              <button 
                type="button" 
                className="secondary-button"
                onClick={handleResend}
                disabled={loading}
              >
                {loading ? 'Resending...' : 'Resend Email'}
              </button>
              <button 
                type="button" 
                className="secondary-button"
                onClick={() => navigate('/login')}
              >
                Back to Login
              </button>
            </div>
          </div>
        )}

        <div className="auth-links">
          <div className="auth-signup">
            Remember your password? <Link to="/login" className="auth-link signup">Sign in</Link>
          </div>
          <div className="auth-signup">
            Don't have an account? <Link to="/register" className="auth-link signup">Sign up</Link>
          </div>
          <Link to="/" className="auth-link home">
            ← Back to Home
          </Link>
        </div>

        <div className="security-notice">
          <small>
            🔒 For security reasons, the password reset link will expire in 1 hour and can only be used once.
          </small>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;