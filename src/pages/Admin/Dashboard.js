import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { db } from '../../config/firebase';
import { collection, getDocs, doc, updateDoc, query, where, onSnapshot } from 'firebase/firestore';
import './AdminDashboard.css';

const Admin_Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated as admin
    const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
    const userType = localStorage.getItem('userType');
    
    if (!isAuthenticated || userType !== 'admin') {
      navigate('/admin/login');
      return;
    }
  }, [navigate]);

};
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [stats, setStats] = useState({
    pendingApprovals: 0,
    activeOfficers: 0,
    totalMembers: 0,
    suspendedAccounts: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
    loadPendingUsers();
    setupRealtimeListeners();
  }, []);

  const loadUserData = async () => {
    try {
      const user = await authService.getCurrentUser();
      
      if (!user) {
        navigate('/login');
        return;
      }

      // ONLY check if user is admin - NO email verification or admin approval needed
      /*if (user.userType !== 'admin') {
        alert('Access denied. This area is for administrators only.');
        await authService.logout();
        navigate('/login');
        return;
      }*/

      setCurrentUser(user);
      setLoading(false);
    } catch (error) {
      console.error('Error loading user:', error);
      navigate('/login');
    }
  };

  const loadPendingUsers = async () => {
    try {
      // Since we removed admin approval, we don't need pending users
      // But keeping this for demonstration if you want to track other statuses
      const usersQuery = query(
        collection(db, 'users'),
        where('status', 'in', ['pending', 'active']) // Updated to include active users
      );
      
      const querySnapshot = await getDocs(usersQuery);
      const usersList = [];
      
      querySnapshot.forEach((doc) => {
        usersList.push({ id: doc.id, ...doc.data() });
      });

      setPendingUsers(usersList);
      
      // Load stats for all users
      const allUsersSnapshot = await getDocs(collection(db, 'users'));
      const allUsers = [];
      allUsersSnapshot.forEach(doc => allUsers.push(doc.data()));
      
      // Updated stats - no more pending approvals since no admin approval needed
      setStats({
        pendingApprovals: 0, // Set to 0 since no approval needed
        activeOfficers: allUsers.filter(u => u.userType === 'security').length, // Removed status check
        totalMembers: allUsers.filter(u => u.userType === 'member').length, // Removed status check
        suspendedAccounts: allUsers.filter(u => u.status === 'suspended').length
      });
      
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const setupRealtimeListeners = () => {
    // Real-time listener for users (optional now)
    const usersQuery = query(collection(db, 'users'));

    const unsubscribe = onSnapshot(usersQuery, (snapshot) => {
      const updatedUsers = [];
      snapshot.forEach((doc) => {
        updatedUsers.push({ id: doc.id, ...doc.data() });
      });
      setPendingUsers(updatedUsers);
      
      // Update stats
      setStats({
        pendingApprovals: 0,
        activeOfficers: updatedUsers.filter(u => u.userType === 'security').length,
        totalMembers: updatedUsers.filter(u => u.userType === 'member').length,
        suspendedAccounts: updatedUsers.filter(u => u.status === 'suspended').length
      });
    });

    return unsubscribe;
  };

  // These functions are kept but modified since no approval needed
  const suspendUser = async (userId) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        status: 'suspended',
        suspendedAt: new Date().toISOString(),
        suspendedBy: currentUser.uid
      });
      
      alert('User suspended successfully!');
      loadPendingUsers(); // Refresh data
    } catch (error) {
      console.error('Error suspending user:', error);
      alert('Error suspending user. Please try again.');
    }
  };

  const activateUser = async (userId) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        status: 'active',
        activatedAt: new Date().toISOString(),
        activatedBy: currentUser.uid
      });
      
      alert('User activated successfully!');
      loadPendingUsers(); // Refresh data
    } catch (error) {
      console.error('Error activating user:', error);
      alert('Error activating user. Please try again.');
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading Admin Dashboard...</p>
      </div>
    );
  }

  if (!currentUser) {
    return null; // Will redirect in loadUserData
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Admin Dashboard</h1>
          <p>Welcome back, {currentUser.firstName}!</p>
          <small>Administrator account - Full system access</small>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => navigate('/admin/manage-users')}>
            User Management
          </button>
          <button className="btn-secondary" onClick={() => navigate('/AdminLogin')}>
            Logout
          </button>
        </div>
      </header>

      {/* Statistics Grid */}
      <div className="stats-grid">
        <div className="stat-card total-users">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.totalMembers + stats.activeOfficers}</h3>
            <p>Total Users</p>
          </div>
        </div>

        <div className="stat-card officers">
          <div className="stat-icon">👮</div>
          <div className="stat-content">
            <h3>{stats.activeOfficers}</h3>
            <p>Security Officers</p>
          </div>
        </div>

        <div className="stat-card members">
          <div className="stat-icon">🏠</div>
          <div className="stat-content">
            <h3>{stats.totalMembers}</h3>
            <p>Community Members</p>
          </div>
        </div>

        <div className="stat-card suspended">
          <div className="stat-icon">⏸️</div>
          <div className="stat-content">
            <h3>{stats.suspendedAccounts}</h3>
            <p>Suspended Accounts</p>
          </div>
        </div>
      </div>

      {/* Recent Users Section (instead of Pending Approvals) */}
      <div className="recent-users">
        <div className="section-header">
          <h2>Recent Users</h2>
          <span className="badge">{pendingUsers.length} total</span>
        </div>
        
        {pendingUsers.length === 0 ? (
          <div className="empty-state">
            <p>No users found</p>
          </div>
        ) : (
          <div className="users-list">
            {pendingUsers.slice(0, 5).map(user => ( // Show only 5 recent users
              <div key={user.id} className="user-item">
                <div className="user-info">
                  <div className="user-avatar">
                    {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                  </div>
                  <div className="user-details">
                    <h4>{user.firstName} {user.lastName}</h4>
                    <p>{user.email}</p>
                    <div className="user-meta">
                      <span className={`user-type ${user.userType}`}>{user.userType}</span>
                      <span className={`status ${user.status}`}>{user.status}</span>
                      {user.createdAt && (
                        <span className="registration-date">
                          Joined: {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="user-actions">
                  {user.status === 'suspended' ? (
                    <button 
                      className="btn-success"
                      onClick={() => activateUser(user.id)}
                    >
                      Activate
                    </button>
                  ) : (
                    <button 
                      className="btn-danger"
                      onClick={() => suspendUser(user.id)}
                    >
                      Suspend
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <div className="action-card" onClick={() => navigate('/admin/manage-users')}>
            <div className="action-icon">👥</div>
            <h4>Manage All Users</h4>
            <p>View and manage all user accounts</p>
          </div>

          <div className="action-card" onClick={() => navigate('/admin/reports')}>
            <div className="action-icon">📊</div>
            <h4>View Reports</h4>
            <p>Weekly, monthly, and yearly patrol reports</p>
          </div>

          <div className="action-card" onClick={() => navigate('/admin/settings')}>
            <div className="action-icon">⚙️</div>
            <h4>System Settings</h4>
            <p>Configure system parameters and alerts</p>
          </div>

          <div className="action-card" onClick={() => alert('Audit log feature coming soon!')}>
            <div className="action-icon">📝</div>
            <h4>Audit Log</h4>
            <p>View system activity and user actions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;