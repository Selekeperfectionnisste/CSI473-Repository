import React from 'react';
import { useNavigate } from 'react-router-dom';

const EmergencyAlert = () => {
  const navigate = useNavigate();
  
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Emergency Alert</h1>
        <button onClick={() => navigate('/member_dashboard')}>Back to Dashboard</button>
      </header>
      <p>Emergency Alert Raised!</p>
    </div>
  );
};

export default EmergencyAlert;