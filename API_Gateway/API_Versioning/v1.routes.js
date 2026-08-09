const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

const gatewayAuth = require('../../Security_Layer/authProtection');
const Order = require('../../Backend_Application/Models/Order');
const authController = require('../../Backend_Application/Controllers/auth.controller');
const { loginLimiter } = require('../rateLimiter');

const path = require('path');

const testUrlV1 = "http://localhost:8080/api/v1/users";
console.log("Test v1:", testUrlV1);

// API Versioning: v1 Users Route (Serves UI)
router.get('/users', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

// API Versioning: v1 Login Route NO Rate Limiting
router.post('/login', authController.login);

// API Versioning: v1 Order Route with Formspree Integration
// Made gatewayAuth optional for demo/guest checkout by handling it manually or just bypassing it if token is invalid
router.post('/orders/confirm', async (req, res) => {
  try {
    const { totalAmount, items } = req.body;
    let userId = 1; // Default guest ID
    let username = 'Guest Customer';

    // In v1, we always treat the user as a Guest Customer regardless of token
    // No auth token check performed for checkout in v1

    const newOrder = await Order.create({ userId, totalAmount });

    // Format Email for Formspree
    const itemsList = items.map(item => `- 1x ${item.name} ($${item.price})`).join('\\n');
    const emailMessage = `Order Confirmed!\\n\\nHello ${username},\\n\\nThank you for shopping at SmartStore. Here are your order details:\\n\\n${itemsList}\\n\\nTotal Amount: $${totalAmount}\\n\\nOrder ID: #${newOrder.id}\\n\\nWe will process this shortly!`;

    const formspreeData = {
      subject: `SmartStore Order #${newOrder.id} Confirmed`,
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
      res.status(200).json({ success: true, message: 'Order placed and email confirmation sent!' });
    } else {
      res.status(200).json({ success: true, message: 'Order placed, but email confirmation failed.' });
    }
  } catch (error) {
    console.error('Order/Formspree Error:', error);
    res.status(500).json({ success: false, message: 'Failed to process checkout' });
  }
});

module.exports = router;
