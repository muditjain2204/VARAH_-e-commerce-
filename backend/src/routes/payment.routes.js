const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const prisma = require('../lib/prisma');
const { authenticate } = require('../middleware/auth');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret',
});

// @route   POST /api/payments/create-order
// @desc    Create a Razorpay order before frontend checkout
// @access  Private
router.post('/create-order', authenticate, async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    if (!amount) {
      return res.status(400).json({ error: true, message: 'Amount is required' });
    }

    const options = {
      amount: Math.round(amount * 100), // Razorpay expects amount in smallest currency subunit (paise)
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1 // Auto-capture
    };

    const order = await razorpay.orders.create(options);

    res.json({
      error: false,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error('Razorpay Create Order Error:', error);
    res.status(500).json({ error: true, message: 'Could not create payment order' });
  }
});

// @route   POST /api/payments/verify
// @desc    Verify Razorpay payment signature after successful frontend payment
// @access  Private
router.post('/verify', authenticate, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderDetails } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret')
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({ error: true, message: 'Invalid payment signature' });
    }

    // Payment is verified! Now save the order in our database
    // orderDetails contains { items, totalAmount, addressId, etc. }
    
    // (We will connect this to your actual Order creation logic later)
    
    res.json({
      error: false,
      message: 'Payment verified successfully',
      paymentId: razorpay_payment_id
    });
  } catch (error) {
    console.error('Razorpay Verify Error:', error);
    res.status(500).json({ error: true, message: 'Payment verification failed' });
  }
});

module.exports = router;
