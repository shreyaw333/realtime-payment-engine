import React from 'react';

const RealtimeUpdates = ({ updates }) => {
  const formatTime = (timestamp) => {
    const now = new Date();
    const updateTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now - updateTime) / 1000);

    if (diffInSeconds < 5) return 'Just now';
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    return `${Math.floor(diffInSeconds / 3600)}h ago`;
  };

  return (
    <div className="realtime-updates">
      <h2 className="section-title">Live Updates</h2>
      
      {updates.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔔</div>
          <div>No recent updates</div>
          <div style={{ fontSize: '14px', marginTop: '10px' }}>
            Real-time notifications will appear here
          </div>
        </div>
      ) : (
        updates.slice(0, 8).map(update => (
          <div key={update.id} className="update-item">
            <div className="update-icon"></div>
            <div style={{ flex: 1 }}>{update.message}</div>
            <div style={{ color: '#666', fontSize: '12px' }}>
              {formatTime(update.timestamp)}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default RealtimeUpdates;