import React from 'react';

const Header = ({ user, balance }) => {
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
            <div>👤 {user.name}</div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Header;