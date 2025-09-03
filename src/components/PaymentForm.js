import React, { useState } from 'react';

const PaymentForm = ({ onPayment, isProcessing }) => {
  const [formData, setFormData] = useState({
    amount: '',
    recipient: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
    paymentMethod: 'card'
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });

  const paymentMethods = [
    { id: 'card', icon: '💳', name: 'Card' },
    { id: 'applepay', icon: '📱', name: 'Apple Pay' },
    { id: 'paypal', icon: '🅿️', name: 'PayPal' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
    } else if (name === 'expiry') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
    } else if (name === 'cvc') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    } else if (name === 'amount') {
      formattedValue = value.replace(/[^0-9.]/g, '');
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.recipient || !formData.recipient.includes('@')) {
      newErrors.recipient = 'Valid email required';
    }

    if (formData.paymentMethod === 'card') {
      if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length < 16) {
        newErrors.cardNumber = 'Valid card number required';
      }

      if (!formData.expiry || !/^\d{2}\/\d{2}$/.test(formData.expiry)) {
        newErrors.expiry = 'Valid expiry date required (MM/YY)';
      }

      if (!formData.cvc || formData.cvc.length < 3) {
        newErrors.cvc = 'Valid CVC required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!validateForm()) {
      return;
    }

    try {
      const result = await onPayment(formData);
      
      if (result.success) {
        setMessage({ 
          type: 'success', 
          text: `Payment of $${formData.amount} processed successfully!` 
        });
        setFormData({
          amount: '',
          recipient: '',
          cardNumber: '',
          expiry: '',
          cvc: '',
          paymentMethod: 'card'
        });
      } else {
        setMessage({ 
          type: 'error', 
          text: result.error || 'Payment failed. Please try again.' 
        });
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.message || 'An error occurred while processing payment.' 
      });
    }
  };

  return (
    <div className="payment-form">
      <h2 className="section-title">New Payment</h2>
      
      {message.text && (
        <div className={`${message.type}-message`}>
          {message.text}
        </div>
      )}

      <div className="payment-methods">
        {paymentMethods.map(method => (
          <div
            key={method.id}
            className={`payment-method ${formData.paymentMethod === method.id ? 'active' : ''}`}
            onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method.id }))}
          >
            <div className="payment-method-icon">{method.icon}</div>
            <div>{method.name}</div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Amount</label>
          <input
            type="text"
            name="amount"
            className={`form-input ${errors.amount ? 'error' : ''}`}
            placeholder="0.00"
            value={formData.amount}
            onChange={handleInputChange}
          />
          {errors.amount && <div className="error-message">{errors.amount}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">Recipient Email</label>
          <input
            type="email"
            name="recipient"
            className={`form-input ${errors.recipient ? 'error' : ''}`}
            placeholder="recipient@example.com"
            value={formData.recipient}
            onChange={handleInputChange}
          />
          {errors.recipient && <div className="error-message">{errors.recipient}</div>}
        </div>

        {formData.paymentMethod === 'card' && (
          <>
            <div className="form-group">
              <label className="form-label">Card Number</label>
              <input
                type="text"
                name="cardNumber"
                className={`form-input ${errors.cardNumber ? 'error' : ''}`}
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber}
                onChange={handleInputChange}
                maxLength="19"
              />
              {errors.cardNumber && <div className="error-message">{errors.cardNumber}</div>}
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Expiry</label>
                <input
                  type="text"
                  name="expiry"
                  className={`form-input ${errors.expiry ? 'error' : ''}`}
                  placeholder="MM/YY"
                  value={formData.expiry}
                  onChange={handleInputChange}
                  maxLength="5"
                />
                {errors.expiry && <div className="error-message">{errors.expiry}</div>}
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">CVC</label>
                <input
                  type="text"
                  name="cvc"
                  className={`form-input ${errors.cvc ? 'error' : ''}`}
                  placeholder="123"
                  value={formData.cvc}
                  onChange={handleInputChange}
                  maxLength="4"
                />
                {errors.cvc && <div className="error-message">{errors.cvc}</div>}
              </div>
            </div>
          </>
        )}

        <button 
          type="submit" 
          className={`btn ${isProcessing ? 'processing' : ''}`}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <span className="spinner"></span>
              Processing...
            </>
          ) : (
            'Process Payment'
          )}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;