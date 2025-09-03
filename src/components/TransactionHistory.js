import React from 'react';

const TransactionHistory = ({ transactions }) => {
  const formatTime = (timestamp) => {
    const now = new Date();
    const transactionTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - transactionTime) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hour${Math.floor(diffInMinutes / 60) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffInMinutes / 1440)} day${Math.floor(diffInMinutes / 1440) > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="transaction-history">
      <h2 className="section-title">Recent Transactions</h2>
      
      {transactions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">💳</div>
          <div>No transactions yet</div>
          <div style={{ fontSize: '14px', marginTop: '10px' }}>
            Process your first payment to get started
          </div>
        </div>
      ) : (
        transactions.slice(0, 10).map(transaction => (
          <div key={transaction.id} className="transaction-item">
            <div className="transaction-details">
              <div className="transaction-id">#{transaction.id}</div>
              <div className="transaction-meta">
                {transaction.type === 'sent' ? 'To:' : 'From:'} {transaction.recipient} • {formatTime(transaction.timestamp)}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className={`transaction-amount ${transaction.type === 'sent' ? 'negative' : 'positive'}`}>
                {transaction.type === 'sent' ? '-' : '+'}${Math.abs(transaction.amount).toFixed(2)}
              </div>
              <div className={`status ${transaction.status}`}>{transaction.status}</div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TransactionHistory;