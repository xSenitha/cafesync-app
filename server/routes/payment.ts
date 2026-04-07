import express from 'express';
import Payment from '../models/Payment.ts';
import Order from '../models/Order.ts';
import { protect } from '../middleware/auth.ts';

const router = express.Router();

// @route   POST /api/payments
// @desc    Process a payment
router.post('/', protect, async (req: any, res) => {
  try {
    const { orderId, amount, paymentMethod } = req.body;

    const newPayment = new Payment({
      orderId,
      user: req.user._id,
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
router.get('/', protect, async (req: any, res) => {
  try {
    let query = {};
    // Only admin, manager and staff can see all payments. Others see only their own.
    if (!['admin', 'manager', 'staff'].includes(req.user.role)) {
      query = { user: req.user._id };
    }
    const payments = await Payment.find(query).populate('orderId').sort({ paidAt: -1, createdAt: -1 });
    res.json(payments);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
