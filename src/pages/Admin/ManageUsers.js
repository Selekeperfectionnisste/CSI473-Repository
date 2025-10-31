import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const ManageUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Mock users data
    setUsers([
      { id: 1, name: 'John Doe', email: 'john@example.com', type: 'member', status: 'pending', registrationDate: '2024-01-15' },
      { id: 2, name: 'Sarah Wilson', email: 'sarah@example.com', type: 'member', status: 'approved', registrationDate: '2024-01-10' },
      { id: 3, name: 'Mike Brown', email: 'mike@example.com', type: 'security', status: 'approved', registrationDate: '2024-01-08' },
      { id: 4, name: 'Lisa Johnson', email: 'lisa@example.com', type: 'member', status: 'suspended', registrationDate: '2024-01-05' }
    ]);
  }, []);

  const approveUser = (userId) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: 'approved' } : user
    ));
    alert('User approved successfully!');
  };

  const suspendUser = (userId) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: 'suspended' } : user
    ));
    alert('User suspended!');
  };

  const deleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
      alert('User deleted successfully!');
    }
  };

  const filteredUsers = users.filter(user => 
    filter === 'all' || user.status === filter
  );

  return (
    <div className="admin-page">
      <header className="page-header">
        <button onClick={() => navigate('/admin/dashboard')} className="btn-back">
          ← Back to Dashboard
        </button>
        <h1>User Management</h1>
      </header>

      <div className="filters">
        <button 
          className={filter === 'all' ? 'active' : ''} 
          onClick={() => setFilter('all')}
        >
          All Users
        </button>
        <button 
          className={filter === 'pending' ? 'active' : ''} 
          onClick={() => setFilter('pending')}
        >
          Pending Approval
        </button>
        <button 
          className={filter === 'suspended' ? 'active' : ''} 
          onClick={() => setFilter('suspended')}
        >
          Suspended
        </button>
      </div>

      <div className="users-list">
        {filteredUsers.map(user => (
          <div key={user.id} className={`user-card ${user.status}`}>
            <div className="user-info">
              <h3>{user.name}</h3>
              <p>{user.email}</p>
              <div className="user-meta">
                <span className={`user-type ${user.type}`}>{user.type}</span>
                <span className="user-date">Registered: {user.registrationDate}</span>
              </div>
            </div>
            <div className="user-actions">
              {user.status === 'pending' && (
                <>
                  <button className="btn-success" onClick={() => approveUser(user.id)}>
                    Approve
                  </button>
                  <button className="btn-danger" onClick={() => deleteUser(user.id)}>
                    Reject
                  </button>
                </>
              )}
              {user.status === 'approved' && (
                <button className="btn-warning" onClick={() => suspendUser(user.id)}>
                  Suspend
                </button>
              )}
              {user.status === 'suspended' && (
                <button className="btn-success" onClick={() => approveUser(user.id)}>
                  Reinstate
                </button>
              )}
              <button className="btn-danger" onClick={() => deleteUser(user.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageUsers;