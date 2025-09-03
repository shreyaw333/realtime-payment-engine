const generateTransactionId = () => {
  return 'TXN-' + Math.random().toString(36).substr(2, 6).toUpperCase();
};

const validatePaymentData = (paymentData) => {
  const errors = [];

  if (!paymentData.amount || paymentData.amount <= 0) {
    errors.push('Amount must be greater than 0');
  }

  if (!paymentData.recipient || !paymentData.recipient.includes('@')) {
    errors.push('Valid recipient email required');
  }

  if (paymentData.paymentMethod === 'card') {
    if (!paymentData.cardNumber || paymentData.cardNumber.replace(/\s/g, '').length < 16) {
      errors.push('Valid card number required');
    }

    if (!paymentData.expiry || !/^\d{2}\/\d{2}$/.test(paymentData.expiry)) {
      errors.push('Valid expiry date required (MM/YY)');
    }

    if (!paymentData.cvc || paymentData.cvc.length < 3) {
      errors.push('Valid CVC required');
    }
  }

  return errors;
};

const simulatePaymentProcessing = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const random = Math.random();
      
      if (random < 0.9) {
        resolve({
          success: true,
          status: 'completed'
        });
      } else if (random < 0.95) {
        resolve({
          success: false,
          status: 'failed',
          error: 'Insufficient funds'
        });
      } else {
        resolve({
          success: false,
          status: 'failed',
          error: 'Card declined'
        });
      }
    }, Math.random() * 2000 + 1000);
  });
};

export const processPayment = async (paymentData) => {
  const validationErrors = validatePaymentData(paymentData);
  
  if (validationErrors.length > 0) {
    throw new Error(validationErrors[0]);
  }

  const transactionId = generateTransactionId();
  
  const result = await simulatePaymentProcessing();
  
  return {
    transactionId,
    status: result.status,
    success: result.success,
    error: result.error,
    timestamp: new Date().toISOString(),
    amount: paymentData.amount,
    recipient: paymentData.recipient
  };
};