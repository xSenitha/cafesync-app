import express from 'express';
import Order from '../models/Order.ts';
import MenuItem from '../models/MenuItem.ts';
import Payment from '../models/Payment.ts';
import { protect, staffOrAbove } from '../middleware/auth.ts';

const router = express.Router();

// Helper to handle payment creation on status update
const handlePaymentOnStatusUpdate = async (orderId: string, status: string, user: any) => {
  if (status === 'Paid') {
    const order = await Order.findById(orderId);
    if (order && order.status !== 'Paid') {
      // Check if payment already exists
      const existingPayment = await Payment.findOne({ orderId });
      if (!existingPayment) {
        await Payment.create({
          orderId: order._id,
          user: order.user,
          amount: order.totalAmount,
          paymentMethod: 'Cash', // Default for manual admin update
          status: 'Completed',
          paidAt: new Date()
        });
      }
    }
  }
};

// @route   GET /api/orders
// @desc    Get all orders (Admin sees all, Customer sees limited for availability)
router.get('/', protect, async (req: any, res) => {
  try {
    let orders;
    if (['admin', 'manager', 'staff'].includes(req.user.role)) {
      orders = await Order.find().populate('items.menuItem').sort({ createdAt: -1 });
    } else {
      // For customers, return their own orders in full
      // AND return other active orders but only with tableNumber and status for availability check
      const myOrders = await Order.find({ user: req.user._id }).populate('items.menuItem').sort({ createdAt: -1 });
      const activeOtherOrders = await Order.find({ 
        user: { $ne: req.user._id },
        status: { $in: ['Pending', 'Preparing', 'Ready', 'Served'] }
      }, 'tableNumber status').sort({ createdAt: -1 });
      
      orders = [...myOrders, ...activeOtherOrders];
    }
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
// @desc    Update order (Staff updates status, Customer updates content if pending)
router.put('/:id', protect, async (req: any, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const isStaff = ['admin', 'manager', 'staff'].includes(req.user.role);
    const isOwner = order.user.toString() === req.user._id.toString();

    if (isStaff) {
      // Staff can update status
      if (req.body.status) {
        await handlePaymentOnStatusUpdate(req.params.id, req.body.status, req.user);
        order.status = req.body.status;
      }
      // Staff might also update content if needed, but usually it's status
      if (req.body.items) order.items = req.body.items;
      if (req.body.tableNumber) order.tableNumber = req.body.tableNumber;
      if (req.body.totalAmount) order.totalAmount = req.body.totalAmount;
      if (req.body.orderType) order.orderType = req.body.orderType;
    } else if (isOwner) {
      // Customer can only update if status is Pending
      if (order.status !== 'Pending') {
        return res.status(400).json({ message: 'Cannot edit order after it has been processed' });
      }
      
      // Update content
      if (req.body.items) order.items = req.body.items;
      if (req.body.tableNumber) order.tableNumber = req.body.tableNumber;
      if (req.body.totalAmount) order.totalAmount = req.body.totalAmount;
      if (req.body.orderType) order.orderType = req.body.orderType;
    } else {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// @route   PATCH /api/orders/:id
// @desc    Partially update order status
router.patch('/:id', protect, staffOrAbove, async (req: any, res) => {
  try {
    if (req.body.status) {
      await handlePaymentOnStatusUpdate(req.params.id, req.body.status, req.user);
    }
    
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

// @route   DELETE /api/orders/clear
// @desc    Clear order history (Paid or Cancelled orders)
router.delete('/clear', protect, async (req: any, res) => {
  try {
    let query: any = { status: { $in: ['Paid', 'Cancelled'] } };
    
    // If not admin/staff, only clear their own history
    if (!['admin', 'manager', 'staff'].includes(req.user.role)) {
      query.user = req.user._id;
    }
    
    await Order.deleteMany(query);
    res.json({ message: 'Order history cleared' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
