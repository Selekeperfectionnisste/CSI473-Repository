import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* Navigation Bar */}
      <nav className="landing-nav">
        <div className="nav-brand">
          <span className="brand-icon">🏠</span>
          <span className="brand-text">NeighborhoodWatch</span>
        </div>
        <div className="nav-links">
          <button 
            className="nav-link"
            onClick={() => navigate('/login')}
          >
            Login
          </button>
          <button 
            className="nav-link primary"
            onClick={() => navigate('/register')}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <span>🔒 Secure Your Community</span>
          </div>
          <h1 className="hero-title">
            Protecting Your Neighborhood,
            <span className="highlight"> Together</span>
          </h1>
          <p className="hero-description">
            Join thousands of communities using NeighborhoodWatch to enhance security, 
            coordinate patrols, and build stronger, safer neighborhoods through technology.
          </p>
          <div className="hero-actions">
            <button 
              className="btn-primary"
              onClick={() => navigate('/register')}
            >
              Start Protecting Your Community
            </button>
            <button 
              className="btn-secondary"
              onClick={() => navigate('/AdminLogin')}
            >
              Are you an Administrator? Login
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="visual-card security">
            <div className="card-icon">👮</div>
            <h3>Security Patrols</h3>
            <p>Real-time monitoring and QR code checkpoints</p>
          </div>
          <div className="visual-card community">
            <div className="card-icon">👥</div>
            <h3>Community Alerts</h3>
            <p>Instant emergency notifications to all members</p>
          </div>
          <div className="visual-card admin">
            <div className="card-icon">📊</div>
            <h3>Smart Analytics</h3>
            <p>Comprehensive reports and patrol statistics</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-header">
          <h2>How NeighborhoodWatch Works</h2>
          <p>Three simple roles, one secure community</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon member">👨‍👩‍👧‍👦</div>
            <h3>Community Members</h3>
            <ul>
              <li>✓ Real-time patrol monitoring</li>
              <li>✓ Emergency alert system</li>
              <li>✓ Community forum access</li>
              <li>✓ Payment management</li>
            </ul>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon security">🛡️</div>
            <h3>Security Officers</h3>
            <ul>
              <li>✓ QR code patrol scanning</li>
              <li>✓ Patrol history tracking</li>
              <li>✓ Real-time alerts</li>
              <li>✓ Mobile-first design</li>
            </ul>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon admin">⚙️</div>
            <h3>Administrators</h3>
            <ul>
              <li>✓ User management</li>
              <li>✓ Comprehensive reports</li>
              <li>✓ System configuration</li>
              <li>✓ Patrol oversight</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Secure Your Neighborhood?</h2>
          <p>Join thousands of communities already using NeighborhoodWatch to enhance their security and build stronger connections.</p>
          <button 
            className="btn-primary large"
            onClick={() => navigate('/register')}
          >
            Get Started Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="brand-icon">🏠</span>
            <span className="brand-text">NeighborhoodWatch</span>
          </div>
          <p>Building safer communities through technology and collaboration</p>
          <div className="footer-links">
            <span>© 2024 NeighborhoodWatch. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;