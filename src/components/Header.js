import React from 'react';

const Header = ({ user, balance, onLogout }) => {
  const handleNavClick = (e) => {
    e.preventDefault();
  };

  return (
    <div className="container">
      <div className="header">
        <nav className="nav">
          <div className="logo">PayFlow</div>
          <div className="nav-links">
            <button className="nav-link active" onClick={handleNavClick}>Dashboard</button>
            <button className="nav-link" onClick={handleNavClick}>Payments</button>
            <button className="nav-link" onClick={handleNavClick}>Transactions</button>
            <button className="nav-link" onClick={handleNavClick}>Settings</button>
          </div>
          <div className="user-info">
            <div className="balance">Balance: ${balance.toFixed(2)}</div>
            <div>👤 {user?.name || 'User'}</div>
            <button 
              onClick={onLogout}
              style={{
                background: '#dc3545',
                color: 'white',
                border: 'none',
                padding: '8px 15px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Logout
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Header;