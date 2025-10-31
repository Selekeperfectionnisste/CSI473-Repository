// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Landing Page
import Landing from './pages/Landing';

// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import VerifySuccess from './pages/Auth/VerifySuccess'; // ADD THIS IMPORT
import AdminLogin from './pages/Auth/AdminLogin';

// Admin Pages
import AdminDashboard from './pages/Admin/Dashboard';
import ManageUsers from './pages/Admin/ManageUsers';
import Reports from './pages/Admin/Reports';
import Settings from './pages/Admin/Settings';

// Security Pages
import SecurityDashboard from './pages/Security/Dashboard';
import QRScanner from './pages/Security/QRScanner';
import PatrolHistory from './pages/Security/PatrolHistory';

// Member Pages
import MemberDashboard from './pages/Member/Dashboard';
import EmergencyAlert from './pages/Member/EmergencyAlert';
import CommunityForum from './pages/Member/CommunityForum';
import PaymentPage from './pages/Member/PaymentPage';

import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<Landing />} />
          
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-success" element={<VerifySuccess />} /> {/* ADD THIS ROUTE */}
          <Route path="/security_dashboard" 
            element={
              
                <SecurityDashboard />
              
            } />
          
          
          {/* Admin Routes */}
          <Route path="/AdminLogin" element={<AdminLogin />} />

          <Route 
            path="/admin/dashboard" 
            element={
              
                <AdminDashboard />
              
            } 
          />
          <Route 
            path="/admin/manage-users" 
            element={
              
                <ManageUsers />
              
            } 
          />
          <Route 
            path="/admin/reports" 
            element={
              
                <Reports />
              
            } 
          />
          <Route 
            path="/admin/settings" 
            element={
              
                <Settings />
              
            } 
          />
          
          {/* Security Routes */}
          <Route 
            path="/security/dashboard" 
            element={
              
                <SecurityDashboard />
          
            } 
          />
          <Route 
            path="/security/scan" 
            element={
              
                <QRScanner />
              
            } 
          />
          <Route 
            path="/security/patrol_history" 
            element={
            
                <PatrolHistory />
        
            } 
          />
          
          {/* Member Routes */}
          <Route 
            path="/member_dashboard" 
            element={
              
                <MemberDashboard />
              
            } 
          />
          <Route path="/member/payment" element={<PaymentPage />} />
          <Route 
            path="/member/emergency-alert" 
            element={
              
                <EmergencyAlert />
        
            } 
          />
          <Route 
            path="/member/community-forum" 
            element={
          
                <CommunityForum />
              
            } 
          />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;