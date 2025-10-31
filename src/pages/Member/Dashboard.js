import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import './MemberDashboard.css';

const MemberDashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [communityStats, setCommunityStats] = useState({
    activePatrols: 0,
    recentAlerts: 0,
    communityPosts: 0,
    subscriptionStatus: 'Active'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUserAccess();
    loadDashboardData();
  }, []);

  const checkUserAccess = async () => {
    try {
      const user = await authService.getCurrentUser();
      
      if (!user) {
        navigate('/login');
        return;
      }

      // REMOVED ADMIN APPROVAL CHECK - Only check if user is a member
      if (user.user_type !== 'member') {
        alert('Access denied. This area is for community members only.');
        await authService.logout();
        navigate('/login');
        return;
      }

      setCurrentUser(user);
    } catch (error) {
      console.error('Error checking user access:', error);
      navigate('/login');
    }
  };

  const loadDashboardData = async () => {
    // Load member-specific data
    setCommunityStats({
      activePatrols: 3,
      recentAlerts: 1,
      communityPosts: 12,
      subscriptionStatus: 'Active'
    });
    setLoading(false);
  };

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  // SIMPLE PAYMENT HANDLER - JUST NAVIGATE TO PAYMENT PAGE
  const handlePayment = () => {
    navigate('/member/payment');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (!currentUser) {
    return null; // Will redirect in checkUserAccess
  }

  return (
    <div className="member-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Member Dashboard</h1>
          <p>Welcome to Neighborhood Watch, {currentUser.firstName}!</p>
          <small>Your account is active and ready to use</small> {/* Updated message */}
        </div>
        <div className="header-actions">
          <button className="btn-payment" onClick={handlePayment}>
            💳 Make Payment
          </button>
          <button className="btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Community Stats */}
      <div className="community-stats">
        <div className="stat-card">
          <div className="stat-icon">👮</div>
          <div className="stat-content">
            <h3>{communityStats.activePatrols}</h3>
            <p>Active Patrols</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🚨</div>
          <div className="stat-content">
            <h3>{communityStats.recentAlerts}</h3>
            <p>Recent Alerts</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💬</div>
          <div className="stat-content">
            <h3>{communityStats.communityPosts}</h3>
            <p>Community Posts</p>
          </div>
        </div>

        <div className="stat-card subscription">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{communityStats.subscriptionStatus}</h3>
            <p>Account Status</p>
          </div>
        </div>
      </div>

      {/* Payment Reminder Section */}
      <div className="payment-section">
        <div className="payment-card">
          <div className="payment-content">
            <div className="payment-icon">💳</div>
            <div>
              <h3>Membership Payment</h3>
              <p>Keep your membership active to enjoy all community security features</p>
            </div>
          </div>
          <button className="btn-payment-primary" onClick={handlePayment}>
            Pay Now
          </button>
        </div>
      </div>

      {/* Emergency Alert Section */}
      <div className="emergency-section">
        <div className="emergency-card">
          <div className="emergency-content">
            <div className="emergency-icon">🚨</div>
            <div>
              <h3>Emergency Alert System</h3>
              <p>Your account is ready and you can now raise emergency alerts</p> {/* Updated message */}
            </div>
          </div>
          <button 
            className="btn-emergency" 
            onClick={() => navigate('/member/emergency-alert')} // Updated to navigate to actual page
          >
            Raise Emergency Alert
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <div className="action-card" onClick={() => navigate('/member/emergency-alert')}>
            <div className="action-icon">🚨</div>
            <h4>Emergency Alert</h4>
            <p>Immediate help request</p>
          </div>

          <div className="action-card" onClick={() => navigate('/member/community-forum')}>
            <div className="action-icon">💬</div>
            <h4>Community Forum</h4>
            <p>Connect with neighbors</p>
          </div>

          <div className="action-card" onClick={() => navigate('/member/PaymentPage')}>
            <div className="action-icon">💳</div>
            <h4>Make Payment</h4>
            <p>Renew membership</p>
          </div>

          <div className="action-card" onClick={() => alert('Patrol statistics - coming soon!')}>
            <div className="action-icon">📊</div>
            <h4>Patrol Stats</h4>
            <p>View security activity</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;