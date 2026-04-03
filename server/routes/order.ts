import express from 'express';
import Order from '../models/Order.ts';
import { protect } from '../middleware/auth.ts';

const router = express.Router();

// @route   GET /api/orders
// @desc    Get all orders
router.get('/', protect, async (req, res) => {
  try {
    const orders = await Order.find().populate('items.menuItem');
    res.json(orders);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/orders
// @desc    Create a new order
router.post('/', protect, async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// @route   PUT /api/orders/:id
// @desc    Update order status
router.put('/:id', protect, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(updatedOrder);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
