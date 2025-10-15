const express = require('express');
const router = express.Router();

router.get('/dashboard', (req, res) => {
  res.json({ message: 'Get dashboard analytics endpoint - coming soon' });
});

router.get('/stats', (req, res) => {
  res.json({ message: 'Get stats endpoint - coming soon' });
});

module.exports = router;