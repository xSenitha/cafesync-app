import express from 'express';
import Table from '../models/Table.ts';
import Order from '../models/Order.ts';
import Reservation from '../models/Reservation.ts';
import { protect, adminOnly, staffOrAbove } from '../middleware/auth.ts';

const router = express.Router();

// Get all tables with dynamic status
router.get('/', async (req, res) => {
  try {
    const tables = await Table.find().sort({ number: 1 }).lean();
    
    // Get active orders
    const activeOrders = await Order.find({
      status: { $in: ['Pending', 'Preparing', 'Ready', 'Served'] }
    });

    // Get upcoming reservations (within 2 hours)
    const now = new Date();
    const TWO_HOURS = 2 * 60 * 60 * 1000;
    const windowEnd = new Date(now.getTime() + TWO_HOURS);
    const windowStart = new Date(now.getTime() - TWO_HOURS);

    const activeReservations = await Reservation.find({
      status: { $in: ['Pending', 'Confirmed'] },
      reservationTime: { $gte: windowStart, $lte: windowEnd }
    });

    const tablesWithStatus = tables.map((table: any) => {
      let currentStatus = table.status || 'Available';

      // Order occupancy takes priority
      const hasOrder = activeOrders.some(o => o.tableNumber === table.number);
      if (hasOrder) {
        currentStatus = 'Occupied';
      } else {
        // Check reservations
        const hasRes = activeReservations.some(r => r.tableNumber === table.number);
        if (hasRes) {
          currentStatus = 'Reserved';
        }
      }

      return { ...table, currentStatus };
    });

    res.json(tablesWithStatus);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Add a table (Admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  const table = new Table({
    number: req.body.number,
    capacity: req.body.capacity
  });

  try {
    const newTable = await table.save();
    res.status(201).json(newTable);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// Update table (Staff or above for status, Admin for number/capacity)
router.put('/:id', protect, staffOrAbove, async (req: any, res) => {
  try {
    const updateData: any = {};
    
    // Staff can update status
    if (req.body.status) updateData.status = req.body.status;
    
    // Admin can update number and capacity
    if (req.user.role === 'admin') {
      if (req.body.number) updateData.number = req.body.number;
      if (req.body.capacity) updateData.capacity = req.body.capacity;
    }

    const updatedTable = await Table.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );
    res.json(updatedTable);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a table (Admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Table.findByIdAndDelete(req.params.id);
    res.json({ message: 'Table deleted' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
