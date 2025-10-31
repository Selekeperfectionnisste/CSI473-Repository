import React from 'react';
import { useNavigate } from 'react-router-dom';

const QRScanner = () => {
  const navigate = useNavigate();
  
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>QR Code Scanner</h1>
        <button onClick={() => navigate('/security/dashboard')}>Back to Dashboard</button>
      </header>
      <p>QR Scanner feature coming soon!</p>
    </div>
  );
};

export default QRScanner;