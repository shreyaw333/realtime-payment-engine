const express = require('express');
const router = express.Router();
const { processPayment, getPayment, refundPayment } = require('../controllers/paymentController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/process', authenticateToken, processPayment);
router.get('/:id', authenticateToken, getPayment);
router.post('/:id/refund', authenticateToken, refundPayment);

module.exports = router;