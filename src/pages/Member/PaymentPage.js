import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import './PaymentPage.css';

const PaymentPage = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [billingAddress, setBillingAddress] = useState({
    line1: '',
    line2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  });

  // Membership plans
  const membershipPlans = [
    {
      id: 'basic',
      name: 'Basic Membership',
      price: 9.99,
      period: 'month',
      features: [
        'Emergency Alerts',
        'Community Forum Access',
        'Basic Patrol Updates',
        'Email Support'
      ]
    },
    {
      id: 'premium',
      name: 'Premium Membership',
      price: 24.99,
      period: 'month',
      features: [
        'All Basic Features',
        'Priority Emergency Response',
        'Advanced Security Reports',
        '24/7 Phone Support',
        'Family Member Coverage'
      ],
      recommended: true
    },
    {
      id: 'annual',
      name: 'Annual Premium',
      price: 249.99,
      period: 'year',
      features: [
        'All Premium Features',
        '2 Months Free',
        'Dedicated Support Manager',
        'Home Security Assessment',
        'Insurance Discount Eligibility'
      ]
    }
  ];

  const [selectedPlan, setSelectedPlan] = useState('premium');

  useEffect(() => {
    checkUserAccess();
  }, []);

  const checkUserAccess = async () => {
    try {
      const user = await authService.getCurrentUser();
      
      if (!user) {
        navigate('/login');
        return;
      }

      if (user.user_type !== 'member') {
        alert('Access denied. This area is for community members only.');
        navigate('/member/dashboard');
        return;
      }

      setCurrentUser(user);
      setLoading(false);
    } catch (error) {
      console.error('Error checking user access:', error);
      navigate('/login');
    }
  };

  const handleCardInputChange = (field, value) => {
    let formattedValue = value;

    // Format card number with spaces
    if (field === 'number') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) formattedValue = formattedValue.slice(0, 19);
    }

    // Format expiry date
    if (field === 'expiry') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
      if (formattedValue.length > 5) formattedValue = formattedValue.slice(0, 5);
    }

    // Format CVV (only numbers, max 4 digits)
    if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setCardDetails(prev => ({
      ...prev,
      [field]: formattedValue
    }));
  };

  const handleAddressChange = (field, value) => {
    setBillingAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      // Validate card details
      if (!validateCardDetails()) {
        setProcessing(false);
        return;
      }

      // Simulate API call to payment gateway
      await simulatePaymentProcessing();

      // In real implementation, you would:
      // 1. Send payment details to your backend
      // 2. Backend processes with payment gateway (Stripe, PayPal, etc.)
      // 3. Handle response and update user subscription

      // Show success message
      alert('Payment successful! Your membership has been activated.');
      
      // Redirect to dashboard
      navigate('/member_dashboard');

    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const validateCardDetails = () => {
    if (!cardDetails.number || cardDetails.number.replace(/\s/g, '').length !== 16) {
      alert('Please enter a valid 16-digit card number');
      return false;
    }

    if (!cardDetails.expiry || !/^\d{2}\/\d{2}$/.test(cardDetails.expiry)) {
      alert('Please enter a valid expiry date (MM/YY)');
      return false;
    }

    if (!cardDetails.cvv || cardDetails.cvv.length < 3) {
      alert('Please enter a valid CVV');
      return false;
    }

    if (!cardDetails.name) {
      alert('Please enter cardholder name');
      return false;
    }

    return true;
  };

  const simulatePaymentProcessing = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, transactionId: 'txn_' + Math.random().toString(36).substr(2, 9) });
      }, 3000);
    });
  };

  const getSelectedPlan = () => {
    return membershipPlans.find(plan => plan.id === selectedPlan);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading payment page...</p>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="payment-container">
        {/* Header */}
        <header className="payment-header">
          <button className="back-button" onClick={() => navigate('/member_dashboard')}>
            ← Back to Dashboard
          </button>
          <h1>Membership Payment</h1>
          <p>Secure payment processing for your community membership</p>
        </header>

        <div className="payment-content">
          {/* Left Column - Payment Form */}
          <div className="payment-form-section">
            <form onSubmit={handlePayment}>
              {/* Plan Selection */}
              <div className="form-section">
                <h3>Select Membership Plan</h3>
                <div className="plan-selection">
                  {membershipPlans.map(plan => (
                    <div
                      key={plan.id}
                      className={`plan-option ${selectedPlan === plan.id ? 'selected' : ''} ${
                        plan.recommended ? 'recommended' : ''
                      }`}
                      onClick={() => setSelectedPlan(plan.id)}
                    >
                      {plan.recommended && <div className="recommended-badge">Recommended</div>}
                      <div className="plan-header">
                        <h4>{plan.name}</h4>
                        <div className="plan-price">
                          ${plan.price}<span>/{plan.period}</span>
                        </div>
                      </div>
                      <ul className="plan-features">
                        {plan.features.map((feature, index) => (
                          <li key={index}>✓ {feature}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div className="form-section">
                <h3>Payment Method</h3>
                <div className="payment-methods">
                  <label className="payment-method-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>Credit/Debit Card</span>
                  </label>
                  <label className="payment-method-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={paymentMethod === 'paypal'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>PayPal</span>
                  </label>
                </div>
              </div>

              {/* Card Details */}
              {paymentMethod === 'card' && (
                <div className="form-section">
                  <h3>Card Details</h3>
                  <div className="card-form">
                    <div className="form-group">
                      <label>Card Number</label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={cardDetails.number}
                        onChange={(e) => handleCardInputChange('number', e.target.value)}
                        maxLength="19"
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Expiry Date</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={cardDetails.expiry}
                          onChange={(e) => handleCardInputChange('expiry', e.target.value)}
                          maxLength="5"
                        />
                      </div>
                      <div className="form-group">
                        <label>CVV</label>
                        <input
                          type="text"
                          placeholder="123"
                          value={cardDetails.cvv}
                          onChange={(e) => handleCardInputChange('cvv', e.target.value)}
                          maxLength="4"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Cardholder Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={cardDetails.name}
                        onChange={(e) => handleCardInputChange('name', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Billing Address */}
              <div className="form-section">
                <h3>Billing Address</h3>
                <div className="address-form">
                  <div className="form-group">
                    <label>Address Line 1</label>
                    <input
                      type="text"
                      placeholder="123 Main St"
                      value={billingAddress.line1}
                      onChange={(e) => handleAddressChange('line1', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Address Line 2 (Optional)</label>
                    <input
                      type="text"
                      placeholder="Apt, Suite, etc."
                      value={billingAddress.line2}
                      onChange={(e) => handleAddressChange('line2', e.target.value)}
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>City</label>
                      <input
                        type="text"
                        placeholder="New York"
                        value={billingAddress.city}
                        onChange={(e) => handleAddressChange('city', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>State</label>
                      <input
                        type="text"
                        placeholder="NY"
                        value={billingAddress.state}
                        onChange={(e) => handleAddressChange('state', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>ZIP Code</label>
                      <input
                        type="text"
                        placeholder="10001"
                        value={billingAddress.zipCode}
                        onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms and Submit */}
              <div className="form-section">
                <label className="terms-agreement">
                  <input type="checkbox" required />
                  <span>
                    I agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>
                  </span>
                </label>

                <button
                  type="submit"
                  className="submit-payment-btn"
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <div className="processing-spinner"></div>
                      Processing Payment...
                    </>
                  ) : (
                    `Pay $${getSelectedPlan().price} Now`
                  )}
                </button>

                <p className="security-note">
                  🔒 Your payment is secure and encrypted
                </p>
              </div>
            </form>
          </div>

          {/* Right Column - Order Summary */}
          <div className="order-summary">
            <div className="summary-card">
              <h3>Order Summary</h3>
              
              <div className="summary-plan">
                <h4>{getSelectedPlan().name}</h4>
                <div className="plan-price">${getSelectedPlan().price}/{getSelectedPlan().period}</div>
              </div>

              <div className="summary-details">
                <div className="summary-row">
                  <span>Membership Fee</span>
                  <span>${getSelectedPlan().price}</span>
                </div>
                <div className="summary-row">
                  <span>Tax</span>
                  <span>$0.00</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>${getSelectedPlan().price}</span>
                </div>
              </div>

              <div className="features-preview">
                <h4>Includes:</h4>
                <ul>
                  {getSelectedPlan().features.slice(0, 3).map((feature, index) => (
                    <li key={index}>✓ {feature}</li>
                  ))}
                  {getSelectedPlan().features.length > 3 && (
                    <li>+ {getSelectedPlan().features.length - 3} more features</li>
                  )}
                </ul>
              </div>

              <div className="benefits">
                <h4>Benefits:</h4>
                <ul>
                  <li>✅ 24/7 Community Support</li>
                  <li>✅ Secure Payment Processing</li>
                  <li>✅ Instant Activation</li>
                  <li>✅ Cancel Anytime</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;