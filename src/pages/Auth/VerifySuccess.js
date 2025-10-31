import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../config/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import './Auth.css';

const VerifySuccess = () => {
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkVerificationStatus();
  }, []);

  const checkVerificationStatus = async () => {
    try {
      // Reload user to get latest verification status
      if (auth.currentUser) {
        await auth.currentUser.reload();
        const user = auth.currentUser;
        
        if (user && user.emailVerified) {
          setVerified(true);
          
          // Update Firestore user document
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            await updateDoc(doc(db, 'users', user.uid), {
              emailVerified: true,
              updatedAt: new Date()
            });
          }
        } else {
          setVerified(false);
        }
      } else {
        setVerified(false);
      }
    } catch (error) {
      console.error('Error checking verification:', error);
      setVerified(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login', { 
      state: { message: 'Email verified successfully! You can now login.' }
    });
  };

  if (loading) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-brand">
              <span className="brand-icon">🏠</span>
              <span className="brand-text">NeighborhoodWatch</span>
            </div>
            <h2>Verifying Your Email</h2>
            <p>Please wait while we verify your email address...</p>
          </div>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-brand">
            <span className="brand-icon">🏠</span>
            <span className="brand-text">NeighborhoodWatch</span>
          </div>
          
          {verified ? (
            <>
              <div className="success-icon">✅</div>
              <h2>Email Verified Successfully!</h2>
              <p>Your email has been verified. You can now login to your account.</p>
            </>
          ) : (
            <>
              <div className="error-icon">❌</div>
              <h2>Verification Failed</h2>
              <p>We couldn't verify your email. The link may have expired or is invalid.</p>
            </>
          )}
        </div>

        {verified ? (
          <div className="auth-actions">
            <button 
              onClick={handleLoginRedirect}
              className="auth-button success"
            >
              Continue to Login
            </button>
          </div>
        ) : (
          <div className="auth-actions">
            <Link to="/login" className="auth-button">
              Back to Login
            </Link>
            <Link to="/register" className="auth-link">
              Register Again
            </Link>
          </div>
        )}

        <div className="auth-links">
          <Link to="/" className="auth-link home">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifySuccess;