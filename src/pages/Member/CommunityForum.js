import React from 'react';
import { useNavigate } from 'react-router-dom';

const CommunityForum = () => {
  const navigate = useNavigate();
  
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Community Forum</h1>
        <button onClick={() => navigate('/member_dashboard')}>Back to Dashboard</button>
      </header>
      <p>Community forum feature coming soon!</p>
    </div>
  );
};

export default CommunityForum;