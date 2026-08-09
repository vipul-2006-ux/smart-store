const express = require('express');
const router = express.Router();
const path = require('path');
const Order = require('../../Backend_Application/Models/Order');
const authController = require('../../Backend_Application/Controllers/auth.controller');
const { loginLimiter } = require('../rateLimiter');

const testUrlV2 = "http://localhost:8080/api/v2/users";
console.log("Test v2:", testUrlV2);

// API Versioning: v2 Users Route (Serves UI)
router.get('/users', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

// API Versioning: v2 Login Route WITH Strict Rate Limiting
router.post('/login', loginLimiter, authController.login);

// API Versioning: v2 Order Route (Uses vipul_1005 logic)
router.post('/orders/confirm', async (req, res) => {
  try {
    const { totalAmount, items } = req.body;
    let userId = 1; // Default guest ID
    let username = 'Customer'; // Default if not logged in

    // Optional auth check
    const token = req.headers['authorization'];
    if (token) {
      try {
        const decoded = require('jsonwebtoken').verify(token.split(' ')[1], require('../../Backend_Application/Configuration/config').jwtSecret);
        userId = decoded.id || 1;
        // Use the real username from the token
        username = decoded.username || 'Customer';
      } catch (err) {}
    }

    const newOrder = await Order.create({ userId, totalAmount });

    // Format Email for Formspree
    const itemsList = items.map(item => `- 1x ${item.name} ($${item.price})`).join('\\n');
    const emailMessage = `Order Confirmed [v2 API]!\\n\\nHello ${username},\\n\\nThank you for shopping at SmartStore. Here are your order details:\\n\\n${itemsList}\\n\\nTotal Amount: $${totalAmount}\\n\\nOrder ID: #${newOrder.id}\\n\\nProcessed via API Version v2.`;

    const formspreeData = {
      subject: `SmartStore Order #${newOrder.id} Confirmed (v2)`,
      username: username,
      order_id: newOrder.id,
      total_amount: totalAmount,
      message: emailMessage
    };

    const formspreeResponse = await fetch('https://formspree.io/f/mzepzlpv', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(formspreeData)
    });

    if (formspreeResponse.ok) {
      res.status(200).json({ success: true, message: 'Order placed via v2 API!' });
    } else {
      res.status(200).json({ success: true, message: 'Order placed via v2 API (Email failed).' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to process checkout (v2)' });
  }
});

module.exports = router;
