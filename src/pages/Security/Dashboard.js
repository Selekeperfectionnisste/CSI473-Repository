import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import './SecurityDashboard.css';

const SecurityDashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [patrolStats, setPatrolStats] = useState({
    completedScans: 0,
    totalGates: 15,
    lastScan: 'Not scanned today',
    patrolStatus: 'Ready',
    complianceRate: '0%'
  });
  const [todaysPatrols, setTodaysPatrols] = useState([]);
  const [emergencyAlerts, setEmergencyAlerts] = useState([]);

  useEffect(() => {
    checkUserAccess();
    loadDashboardData();
  }, []);

  const checkUserAccess = async () => {
    try {
      const user = await authService.getCurrentUser();
      console.log(user);
      if (!user) {
        navigate('/login');
        return;
      }
  
      // Only check if user is security - NO admin approval needed
      if (user.user_type !== 'security') {
        alert('Access denied. This area is for security officers only.');
        await authService.logout();
        navigate('/login');
        return;
      }

      setCurrentUser(user);
      setLoading(false);
    } catch (error) {
      console.error('Error checking user access:', error);
      navigate('/login');
    }
  };

  const loadDashboardData = async () => {
    // Mock data
    setPatrolStats({
      completedScans: 8,
      totalGates: 15,
      lastScan: '14:30',
      patrolStatus: 'Active',
      complianceRate: '73%'
    });

    setTodaysPatrols([
      { id: 1, gate: 'Main Gate', time: '08:15', status: 'completed', notes: 'All secure' },
      { id: 2, gate: 'North Gate', time: '10:30', status: 'completed', notes: 'Gate unlocked' },
      { id: 3, gate: 'South Gate', time: '12:45', status: 'completed', notes: '' },
      { id: 4, gate: 'East Gate', time: '14:30', status: 'completed', notes: 'Dogs outside' },
      { id: 5, gate: 'West Gate', time: '--:--', status: 'pending', notes: '' }
    ]);

    setEmergencyAlerts([
      { id: 1, type: 'emergency', location: 'Block 12', time: '13:20', status: 'active' }
    ]);
  };

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  const simulateScan = () => {
    const newScan = {
      id: Date.now(),
      gate: 'West Gate',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'completed',
      notes: 'Automated test scan'
    };
    
    setTodaysPatrols(prev => [newScan, ...prev.filter(p => p.gate !== 'West Gate')]);
    setPatrolStats(prev => ({
      ...prev,
      completedScans: prev.completedScans + 1,
      lastScan: newScan.time,
      complianceRate: `${Math.round(((prev.completedScans + 1) / prev.totalGates) * 100)}%`
    }));
    
    alert('QR Code scanned successfully! Patrol recorded.');
  };

  const addPatrolNote = (patrolId) => {
    const note = prompt('Add patrol notes:');
    if (note) {
      setTodaysPatrols(prev => 
        prev.map(patrol => 
          patrol.id === patrolId ? { ...patrol, notes: note } : patrol
        )
      );
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading security dashboard...</p>
      </div>
    );
  }

  if (!currentUser) {
    return null; // Will redirect in checkUserAccess
  }

  return (
    <div className="security-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Security Officer Dashboard</h1>
          <p>Welcome, Officer {currentUser.lastName}! Ready for patrol?</p>
          <small>Your security account is active and ready</small>
        </div>
        <div className="header-actions">
          <button className="btn-emergency" onClick={() => alert('Emergency protocol activated!')}>
            🚨 Emergency
          </button>
          <button className="btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="stat-card">
          <div className="stat-icon">📱</div>
          <div className="stat-content">
            <h3>{patrolStats.completedScans}/{patrolStats.totalGates}</h3>
            <p>Gates Scanned</p>
          </div>
          <div className="stat-progress">
            <div 
              className="progress-bar" 
              style={{ width: patrolStats.complianceRate }}
            ></div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏰</div>
          <div className="stat-content">
            <h3>{patrolStats.lastScan}</h3>
            <p>Last Scan</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{patrolStats.complianceRate}</h3>
            <p>Compliance Rate</p>
          </div>
        </div>

        <div className="stat-card status">
          <div className="stat-icon">🟢</div>
          <div className="stat-content">
            <h3>{patrolStats.patrolStatus}</h3>
            <p>Patrol Status</p>
          </div>
        </div>
      </div>

      {/* Main Action */}
      <div className="main-action-section">
        <div className="action-card primary">
          <div className="action-icon">📷</div>
          <div className="action-content">
            <h2>Start Patrol Scan</h2>
            <p>Scan QR codes at each gate to record your patrol</p>
          </div>
          <button className="btn-scan" onClick={simulateScan}>
            Simulate QR Scan
          </button>
        </div>
      </div>

      {/* Today's Patrols */}
      <div className="patrols-section">
        <div className="section-header">
          <h2>Today's Patrol Record</h2>
          <button 
            className="btn-outline"
            onClick={() => navigate('/security/patrol-history')}
          >
            View Full History
          </button>
        </div>
        
        <div className="patrols-list">
          {todaysPatrols.map(patrol => (
            <div key={patrol.id} className={`patrol-item ${patrol.status}`}>
              <div className="patrol-icon">
                {patrol.status === 'completed' ? '✅' : '⏳'}
              </div>
              <div className="patrol-details">
                <h4>{patrol.gate}</h4>
                <p>{patrol.time}</p>
                {patrol.notes && <span className="patrol-notes">📝 {patrol.notes}</span>}
              </div>
              <div className="patrol-actions">
                {patrol.status === 'completed' ? (
                  <button 
                    className="btn-small"
                    onClick={() => addPatrolNote(patrol.id)}
                  >
                    Add Note
                  </button>
                ) : (
                  <button 
                    className="btn-small primary"
                    onClick={simulateScan}
                  >
                    Scan Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Alerts */}
      {emergencyAlerts.length > 0 && (
        <div className="emergency-section">
          <h2>Active Emergencies</h2>
          <div className="emergency-list">
            {emergencyAlerts.map(alert => (
              <div key={alert.id} className="emergency-alert">
                <div className="alert-icon">🚨</div>
                <div className="alert-content">
                  <h4>Emergency Alert - {alert.location}</h4>
                  <p>Reported at {alert.time} - Immediate response required</p>
                </div>
                <button className="btn-emergency">
                  Respond
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button 
            className="action-btn"
            onClick={() => navigate('/security/SecurityDashboard')}
          >
            <span className="action-icon">📋</span>
            <span>Patrol History</span>
          </button>

          <button 
            className="action-btn"
            onClick={() => {
              const note = prompt('Enter incident report:');
              if (note) alert('Incident reported successfully!');
            }}
          >
            <span className="action-icon">📝</span>
            <span>Report Incident</span>
          </button>

          <button 
            className="action-btn"
            onClick={() => alert('Shift report generated!')}
          >
            <span className="action-icon">📄</span>
            <span>Shift Report</span>
          </button>

          <button 
            className="action-btn"
            onClick={() => navigate('/security/scan')}
          >
            <span className="action-icon">🔍</span>
            <span>QR Scanner</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecurityDashboard;