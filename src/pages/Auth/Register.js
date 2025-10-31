import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    userId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'member',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear specific field error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    setMessage('');
  };

  const validateForm = () => {
    const newErrors = {};

    // ID validation
    if (!formData.userId.trim()) {
      newErrors.userId = 'User ID is required';
    } else if (!/^\d{1,9}$/.test(formData.userId)) {
      newErrors.userId = 'ID must be numeric and up to 9 digits';
    }

    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Address validation for members
    if (formData.userType === 'member' && !formData.address.trim()) {
      newErrors.address = 'Address is required for community members';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  console.log('🟢 Form submitted');
  console.log('📋 Form data:', formData);
  
  setLoading(true);
  setMessage('');
  setErrors({});

  if (!validateForm()) {
    console.log('🔴 Form validation failed');
    setLoading(false);
    return;
  }

  console.log('🟢 Form validation passed, calling authService...');

  try {
    const result = await authService.register(formData);
    console.log('🟢 Registration result:', result);
    
    if (result.success) {
      setMessage('Registration successful! Redirecting to login...');
      
      // Clear form
      setFormData({
        userId: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        userType: 'member',
        address: ''
      });
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      // Handle duplicate errors specifically
      if (result.errors) {
        setErrors(result.errors);
        
        // Create user-friendly message for duplicates
        const duplicateFields = Object.keys(result.errors);
        if (duplicateFields.length > 0) {
          const fieldNames = {
            'id': 'User ID',
            'email': 'Email address',
            'contact_number': 'Phone number', 
            'name': 'First and last name combination',
            'home_address': 'Home address',
            'password': 'Password'
          };
          
          const duplicateList = duplicateFields.map(field => fieldNames[field] || field).join(', ');
          setMessage(`The following information is already registered: ${duplicateList}. Please use different information.`);
        } else {
          setMessage(result.message || 'Registration failed');
        }
      } else {
        setMessage(result.message || 'Registration failed');
      }
      console.log('🔴 Registration failed:', result);
    }
  } catch (error) {
    console.error('🔴 Registration catch error:', error);
    setMessage('Registration failed. Please try again.');
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
          <h2>Join Our Community</h2>
          <p>Create your account to get started</p>
        </div>
        
        {message && (
          <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>
            {message}
          </div>
        )}
        
       <form onSubmit={handleSubmit} className="auth-form">
  {/* User ID Field */}
  <div className="form-group">
    <label htmlFor="userId">User ID *</label>
    <input
      type="text"
      id="userId"
      name="userId"
      value={formData.userId}
      onChange={handleChange}
      required
      disabled={loading}
      placeholder="Enter your user ID (numbers only)"
      className={errors.id || errors.userId ? 'error' : ''}
    />
    {errors.id && <span className="field-error">{errors.id}</span>}
    {errors.userId && <span className="field-error">{errors.userId}</span>}
    <small className="hint">Must be numeric, up to 9 digits</small>
  </div>

  <div className="form-row">
    <div className="form-group">
      <label htmlFor="firstName">First Name *</label>
      <input
        type="text"
        id="firstName"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        required
        disabled={loading}
        placeholder="Enter your first name"
        className={errors.firstName || errors.name ? 'error' : ''}
      />
      {errors.firstName && <span className="field-error">{errors.firstName}</span>}
    </div>
    
    <div className="form-group">
      <label htmlFor="lastName">Last Name *</label>
      <input
        type="text"
        id="lastName"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        required
        disabled={loading}
        placeholder="Enter your last name"
        className={errors.lastName || errors.name ? 'error' : ''}
      />
      {errors.lastName && <span className="field-error">{errors.lastName}</span>}
      {errors.name && <span className="field-error">{errors.name}</span>}
    </div>
  </div>
  
  <div className="form-group">
    <label htmlFor="email">Email Address *</label>
    <input
      type="email"
      id="email"
      name="email"
      value={formData.email}
      onChange={handleChange}
      required
      disabled={loading}
      placeholder="Enter your email"
      className={errors.email ? 'error' : ''}
    />
    {errors.email && <span className="field-error">{errors.email}</span>}
  </div>
  
  <div className="form-group">
    <label htmlFor="phone">Phone Number *</label>
    <input
      type="tel"
      id="phone"
      name="phone"
      value={formData.phone}
      onChange={handleChange}
      required
      disabled={loading}
      placeholder="+267 XXX XXXX"
      className={errors.contact_number ? 'error' : ''}
    />
    {errors.contact_number && <span className="field-error">{errors.contact_number}</span>}
  </div>
  
  <div className="form-group">
    <label htmlFor="userType">I am a *</label>
    <select
      id="userType"
      name="userType"
      value={formData.userType}
      onChange={handleChange}
      disabled={loading}
    >
      <option value="member">Community Member</option>
      <option value="security">Security Officer</option>
    </select>
  </div>
  
  {formData.userType === 'member' && (
    <div className="form-group">
      <label htmlFor="address">Home Address *</label>
      <textarea
        id="address"
        name="address"
        value={formData.address}
        onChange={handleChange}
        required
        disabled={loading}
        placeholder="Enter your full residential address"
        className={errors.home_address ? 'error' : ''}
        rows="3"
      />
      {errors.home_address && <span className="field-error">{errors.home_address}</span>}
    </div>
  )}
  
  <div className="form-row">
    <div className="form-group">
      <label htmlFor="password">Password *</label>
      <input
        type="password"
        id="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        required
        disabled={loading}
        placeholder="Create a password"
        className={errors.password ? 'error' : ''}
      />
      {errors.password && <span className="field-error">{errors.password}</span>}
    </div>
    
    <div className="form-group">
      <label htmlFor="confirmPassword">Confirm Password *</label>
      <input
        type="password"
        id="confirmPassword"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        required
        disabled={loading}
        placeholder="Confirm your password"
        className={errors.confirmPassword ? 'error' : ''}
      />
      {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
    </div>
  </div>
  
  <button 
    type="submit" 
    className={`auth-button ${loading ? 'loading' : ''}`}
    disabled={loading}
  >
    {loading ? (
      <>
        <div className="spinner"></div>
        Creating Account...
      </>
    ) : (
      'Create Account'
    )}
  </button>
</form>
        <div className="auth-links">
          <div className="auth-signup">
            Already have an account? <Link to="/login" className="auth-link signup">Sign in</Link>
          </div>
          <Link to="/" className="auth-link home">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;