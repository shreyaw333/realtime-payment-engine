let stripe = null;
try {
  if (process.env.STRIPE_SECRET_KEY) {
    stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  }
} catch (error) {
  console.error('Stripe initialization failed:', error.message);
}

const db = require('../config/database');

const processPayment = async (req, res) => {
  try {
    const { amount, recipient, paymentMethod, cardToken } = req.body;
    const userId = req.user.userId;

    if (!amount || !recipient) {
      return res.status(400).json({ error: 'Amount and recipient are required' });
    }

    const transactionId = 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase();

    if (paymentMethod === 'card' && cardToken && stripe) {
      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(amount * 100),
          currency: 'usd',
          payment_method: cardToken,
          confirm: true,
          automatic_payment_methods: {
            enabled: true,
            allow_redirects: 'never'
          }
        });

        if (paymentIntent.status === 'succeeded') {
          db.run(
            `INSERT INTO transactions (transaction_id, user_id, amount, recipient, status, payment_method, type) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [transactionId, userId, amount, recipient, 'completed', paymentMethod, 'sent'],
            function(err) {
              if (err) {
                return res.status(500).json({ error: 'Error saving transaction' });
              }

              db.run(
                'UPDATE users SET balance = balance - ? WHERE id = ?',
                [amount, userId],
                (err) => {
                  if (err) {
                    return res.status(500).json({ error: 'Error updating balance' });
                  }

                  res.json({
                    success: true,
                    transactionId,
                    status: 'completed',
                    amount,
                    recipient
                  });
                }
              );
            }
          );
        } else {
          res.status(400).json({
            success: false,
            status: 'failed',
            error: 'Payment failed'
          });
        }
      } catch (stripeError) {
        db.run(
          `INSERT INTO transactions (transaction_id, user_id, amount, recipient, status, payment_method, type, error_message) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [transactionId, userId, amount, recipient, 'failed', paymentMethod, 'sent', stripeError.message]
        );

        res.status(400).json({
          success: false,
          status: 'failed',
          error: stripeError.message
        });
      }
    } else {
      const randomSuccess = Math.random() > 0.1;
      const status = randomSuccess ? 'completed' : 'failed';

      db.run(
        `INSERT INTO transactions (transaction_id, user_id, amount, recipient, status, payment_method, type) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [transactionId, userId, amount, recipient, status, paymentMethod, 'sent'],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Error saving transaction' });
          }

          if (status === 'completed') {
            db.run(
              'UPDATE users SET balance = balance - ? WHERE id = ?',
              [amount, userId]
            );
          }

          res.json({
            success: status === 'completed',
            transactionId,
            status,
            amount,
            recipient,
            error: status === 'failed' ? 'Payment declined' : null
          });
        }
      );
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getPayment = (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  db.get(
    'SELECT * FROM transactions WHERE transaction_id = ? AND user_id = ?',
    [id, userId],
    (err, transaction) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found' });
      }

      res.json(transaction);
    }
  );
};

const refundPayment = async (req, res) => {
  res.json({ message: 'Refund functionality - coming soon' });
};

const transferToUser = async (req, res) => {
  try {
    const { amount, recipientEmail } = req.body;
    const senderId = req.user.userId;

    if (!amount || !recipientEmail) {
      return res.status(400).json({ error: 'Amount and recipient email are required' });
    }

    db.get('SELECT * FROM users WHERE email = ?', [recipientEmail], (err, recipient) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!recipient) {
        return res.status(404).json({ error: 'Recipient not found' });
      }

      if (recipient.id === senderId) {
        return res.status(400).json({ error: 'Cannot send money to yourself' });
      }

      db.get('SELECT balance FROM users WHERE id = ?', [senderId], (err, sender) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        if (sender.balance < amount) {
          return res.status(400).json({ error: 'Insufficient balance' });
        }

        const transactionId = 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase();

        db.run('UPDATE users SET balance = balance - ? WHERE id = ?', [amount, senderId], (err) => {
          if (err) {
            return res.status(500).json({ error: 'Error updating sender balance' });
          }

          db.run('UPDATE users SET balance = balance + ? WHERE id = ?', [amount, recipient.id], (err) => {
            if (err) {
              db.run('UPDATE users SET balance = balance + ? WHERE id = ?', [amount, senderId]);
              return res.status(500).json({ error: 'Error updating recipient balance' });
            }

            db.run(
              `INSERT INTO transactions (transaction_id, user_id, amount, recipient, status, payment_method, type) 
               VALUES (?, ?, ?, ?, ?, ?, ?)`,
              [transactionId, senderId, amount, recipientEmail, 'completed', 'p2p', 'sent']
            );

            db.run(
              `INSERT INTO transactions (transaction_id, user_id, amount, recipient, status, payment_method, type) 
               VALUES (?, ?, ?, ?, ?, ?, ?)`,
              [transactionId, recipient.id, amount, req.user.email, 'completed', 'p2p', 'received']
            );

            res.json({
              success: true,
              transactionId,
              status: 'completed',
              amount,
              recipient: recipientEmail,
              recipientName: recipient.name
            });
          });
        });
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { processPayment, getPayment, refundPayment, transferToUser };