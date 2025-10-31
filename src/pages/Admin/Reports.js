import React from 'react';
import { useNavigate } from 'react-router-dom';

const ManageUsers = () => {
  const navigate = useNavigate();
  
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Manage Users</h1>
        <button onClick={() => navigate('/admin/dashboard')}>Back to Dashboard</button>
      </header>
      <p>User management feature coming soon!</p>
    </div>
  );
};

export default ManageUsers;