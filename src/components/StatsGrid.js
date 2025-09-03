import React from 'react';

const StatsGrid = ({ stats }) => {
  const formatCurrency = (amount) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    } else {
      return `$${amount.toFixed(0)}`;
    }
  };

  const statCards = [
    {
      id: 'total',
      value: formatCurrency(stats.totalProcessed),
      label: 'Total Processed',
      icon: '💰'
    },
    {
      id: 'transactions',
      value: stats.transactionCount.toString(),
      label: 'Transactions',
      icon: '📊'
    },
    {
      id: 'success',
      value: `${stats.successRate}%`,
      label: 'Success Rate',
      icon: '✅'
    },
    {
      id: 'speed',
      value: stats.avgProcessingTime,
      label: 'Avg Processing Time',
      icon: '⚡'
    }
  ];

  return (
    <div className="stats-container">
      {statCards.map(card => (
        <div key={card.id} className="stat-card">
          <div style={{ fontSize: '20px', marginBottom: '10px' }}>{card.icon}</div>
          <div className="stat-value">{card.value}</div>
          <div className="stat-label">{card.label}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;