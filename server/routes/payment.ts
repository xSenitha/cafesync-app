import express from 'express';
import Payment from '../models/Payment.ts';
import Order from '../models/Order.ts';
import { protect } from '../middleware/auth.ts';

const router = express.Router();

// @route   POST /api/payments
// @desc    Process a payment
router.post('/', protect, async (req, res) => {
  try {
    const { orderId, amount, paymentMethod } = req.body;

    const newPayment = new Payment({
      orderId,
      amount,
      paymentMethod,
      status: 'Completed',
    });

    await newPayment.save();

    // Update order status to 'Paid'
    await Order.findByIdAndUpdate(orderId, { status: 'Paid' });

    res.status(201).json(newPayment);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// @route   GET /api/payments
// @desc    Get payment history
router.get('/', protect, async (req, res) => {
  try {
    const payments = await Payment.find().populate('orderId');
    res.json(payments);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
