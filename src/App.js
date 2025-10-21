import React, { useState } from 'react';
import Header from './components/Header';
import PaymentForm from './components/PaymentForm';
import TransactionHistory from './components/TransactionHistory';
import RealtimeUpdates from './components/RealtimeUpdates';
import StatsGrid from './components/StatsGrid';
import { processPayment } from './utils/paymentProcessor';
import './styles/App.css';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(5000.00);
  const [isProcessing, setIsProcessing] = useState(false);
  const [realtimeUpdates, setRealtimeUpdates] = useState([]);
  const [user] = useState({
    name: 'Demo User',
    email: 'demo@payflow.com'
  });

  const addRealtimeUpdate = (message) => {
    const update = {
      id: Math.random().toString(36).substr(2, 9),
      message,
      timestamp: new Date().toISOString(),
      time: 'Just now'
    };
    setRealtimeUpdates(prev => [update, ...prev].slice(0, 10));
  };

  const handlePayment = async (paymentData) => {
    setIsProcessing(true);
    addRealtimeUpdate(`Processing payment of $${paymentData.amount}...`);

    try {
      const result = await processPayment(paymentData);
      
      const newTransaction = {
        id: result.transactionId,
        amount: parseFloat(paymentData.amount),
        recipient: paymentData.recipient,
        status: result.status,
        timestamp: new Date().toISOString(),
        paymentMethod: paymentData.paymentMethod,
        type: 'sent'
      };

      setTransactions(prev => [newTransaction, ...prev]);

      if (result.status === 'completed') {
        setBalance(prev => prev - parseFloat(paymentData.amount));
        addRealtimeUpdate(`Payment #${result.transactionId} completed successfully`);
      } else if (result.status === 'failed') {
        addRealtimeUpdate(`Payment #${result.transactionId} failed - ${result.error}`);
      }

      return result;
    } catch (error) {
      addRealtimeUpdate(`Payment processing error: ${error.message}`);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const stats = {
    totalProcessed: transactions
      .filter(t => t.status === 'completed')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0),
    transactionCount: transactions.length,
    successRate: transactions.length > 0 
      ? ((transactions.filter(t => t.status === 'completed').length / transactions.length) * 100).toFixed(1)
      : 100,
    avgProcessingTime: '0.3s'
  };

  return (
    <div className="App">
      <Header user={user} balance={balance} />
      
      <div className="container">
        <div className="main-content">
          <PaymentForm 
            onPayment={handlePayment} 
            isProcessing={isProcessing}
          />
          <TransactionHistory transactions={transactions} />
        </div>
        
        <RealtimeUpdates updates={realtimeUpdates} />
        <StatsGrid stats={stats} />
      </div>
    </div>
  );
}

export default App;