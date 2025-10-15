const db = require('../config/database');

const getProfile = (req, res) => {
  const userId = req.user.userId;

  db.get('SELECT id, email, name, balance, created_at FROM users WHERE id = ?', [userId], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        balance: user.balance,
        createdAt: user.created_at
      }
    });
  });
};

const updateProfile = (req, res) => {
  const userId = req.user.userId;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  db.run(
    'UPDATE users SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [name, userId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Error updating profile' });
      }

      res.json({ message: 'Profile updated successfully' });
    }
  );
};

const getBalance = (req, res) => {
  const userId = req.user.userId;

  db.get('SELECT balance FROM users WHERE id = ?', [userId], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ balance: user.balance });
  });
};

module.exports = { getProfile, updateProfile, getBalance };