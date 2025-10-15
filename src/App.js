import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Header from './components/Header';
import PaymentForm from './components/PaymentForm';
import TransactionHistory from './components/TransactionHistory';
import RealtimeUpdates from './components/RealtimeUpdates';
import StatsGrid from './components/StatsGrid';
import { paymentAPI, getAuthToken, removeAuthToken, userAPI } from './services/api';
import './styles/App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(5000.00);
  const [isProcessing, setIsProcessing] = useState(false);
  const [realtimeUpdates, setRealtimeUpdates] = useState([]);

  useEffect(() => {
  const token = getAuthToken();
  if (token) {
    setIsAuthenticated(true);
    
    userAPI.getProfile()
      .then(data => {
        setUser(data.user);
        setBalance(data.user.balance);
      })
      .catch(err => {
        console.error('Failed to fetch user:', err);
        removeAuthToken();
        setIsAuthenticated(false);
      });
  }
}, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setBalance(userData.balance);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    removeAuthToken();
    setIsAuthenticated(false);
    setUser(null);
    setTransactions([]);
    setBalance(0);
    setRealtimeUpdates([]);
  };

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
      const result = await paymentAPI.processPayment({
        amount: parseFloat(paymentData.amount),
        recipient: paymentData.recipient,
        paymentMethod: paymentData.paymentMethod
      });

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

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="App">
      <Header user={user} balance={balance} onLogout={handleLogout} />
      
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