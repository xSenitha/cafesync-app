import express from 'express';
import Order from '../models/Order.ts';
import MenuItem from '../models/MenuItem.ts';
import { protect, staffOrAbove } from '../middleware/auth.ts';

const router = express.Router();

// @route   GET /api/orders
// @desc    Get all orders
router.get('/', protect, async (req: any, res) => {
  try {
    let query = {};
    // Only admin, manager and staff can see all orders. Others see only their own.
    if (!['admin', 'manager', 'staff'].includes(req.user.role)) {
      query = { user: req.user._id };
    }
    const orders = await Order.find(query).populate('items.menuItem').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/orders
// @desc    Create a new order
router.post('/', protect, async (req: any, res) => {
  try {
    const { tableNumber, items, totalAmount, orderType } = req.body;
    
    // Create new order
    const newOrder = new Order({
      user: req.user._id,
      customerName: req.user.name,
      tableNumber,
      items,
      totalAmount,
      orderType
    });

    await newOrder.save();

    // Update stock for each item
    for (const item of items) {
      await MenuItem.findByIdAndUpdate(item.menuItem, {
        $inc: { stockQuantity: -item.quantity }
      });
    }

    res.status(201).json(newOrder);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// @route   PUT /api/orders/:id
// @desc    Update order status
router.put('/:id', protect, staffOrAbove, async (req, res) => {
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

// @route   PATCH /api/orders/:id
// @desc    Partially update order status
router.patch('/:id', protect, staffOrAbove, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updatedOrder);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
