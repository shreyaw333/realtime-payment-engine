const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Get all transactions endpoint - coming soon' });
});

router.get('/:id', (req, res) => {
  res.json({ message: 'Get single transaction endpoint - coming soon' });
});

module.exports = router;