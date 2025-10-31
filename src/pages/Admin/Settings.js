import React from 'react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const navigate = useNavigate();
  
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>System Settings</h1>
        <button onClick={() => navigate('/admin/dashboard')}>Back to Dashboard</button>
      </header>
      <p>System settings feature coming soon!</p>
    </div>
  );
};

export default Settings;