import React from 'react';

const Header = ({ user, balance }) => {
  return (
    <div className="container">
      <div className="header">
        <nav className="nav">
          <div className="logo">PayFlow</div>
          <div className="nav-links">
            <a href="#" className="nav-link active">Dashboard</a>
            <a href="#" className="nav-link">Payments</a>
            <a href="#" className="nav-link">Transactions</a>
            <a href="#" className="nav-link">Settings</a>
          </div>
          <div className="user-info">
            <div className="balance">Balance: ${balance.toFixed(2)}</div>
            <div>👤 {user.name}</div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Header;