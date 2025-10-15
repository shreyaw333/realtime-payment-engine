const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getBalance } = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.get('/balance', authenticateToken, getBalance);

module.exports = router;