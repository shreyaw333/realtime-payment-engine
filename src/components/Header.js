import React from 'react';

const Header = ({ user, balance, onLogout }) => {
  return (
    <div className="container">
      <div className="header">
        <nav className="nav">
          <div className="logo">PayFlow</div>
          <div className="nav-links">
            <button className="nav-link active">Dashboard</button>
          </div>
          <div className="user-info">
            <div className="balance">Balance: ${balance.toFixed(2)}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img src="/user.png" alt="User" style={{ width: '20px', height: '20px' }} />
              {user?.name || 'User'}
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Header;