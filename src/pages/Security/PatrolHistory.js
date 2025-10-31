import React from 'react';
import { useNavigate } from 'react-router-dom';

const PatrolHistory = () => {
  const navigate = useNavigate();
  
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Patrol History</h1>
        <button onClick={() => navigate('/security/dashboard')}>Back to Dashboard</button>
      </header>
      <p>Patrol history feature coming soon!</p>
    </div>
  );
};

export default PatrolHistory;