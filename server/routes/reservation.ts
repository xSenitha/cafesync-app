import express from 'express';
import Reservation from '../models/Reservation.ts';
import { protect } from '../middleware/auth.ts';

const router = express.Router();

// @route   GET /api/reservations
// @desc    Get all reservations (Admin sees all, Customer sees limited for availability)
router.get('/', protect, async (req: any, res) => {
  try {
    let reservations;
    if (req.user.role === 'admin' || req.user.role === 'staff') {
      reservations = await Reservation.find().sort({ reservationTime: 1 });
    } else {
      // For customers, return all reservations but hide sensitive info 
      // so they can check table availability
      reservations = await Reservation.find({}, 'user tableNumber reservationTime status numberOfGuests').sort({ reservationTime: 1 });
    }
    res.json(reservations);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// @route   GET /api/reservations/my
// @desc    Get current user's reservations
router.get('/my', protect, async (req: any, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user._id }).sort({ reservationTime: 1 });
    res.json(reservations);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/reservations
// @desc    Create a reservation
router.post('/', protect, async (req: any, res) => {
  try {
    const { customerName, customerPhone, tableNumber, numberOfGuests, reservationTime, notes } = req.body;
    
    // Convert to Date object
    const requestedTime = new Date(reservationTime);
    
    // Check for past time
    if (requestedTime < new Date()) {
      return res.status(400).json({ message: 'Cannot reserve for a past time' });
    }

    // Check for overlapping reservations (2 hour window)
    const TWO_HOURS = 2 * 60 * 60 * 1000;
    const windowStart = new Date(requestedTime.getTime() - TWO_HOURS);
    const windowEnd = new Date(requestedTime.getTime() + TWO_HOURS);

    const overlap = await Reservation.findOne({
      tableNumber,
      status: { $in: ['Pending', 'Confirmed'] },
      reservationTime: {
        $gte: windowStart,
        $lte: windowEnd
      }
    });

    if (overlap) {
      return res.status(400).json({ message: 'Table already reserved for this time period' });
    }

    const newReservation = new Reservation({
      user: req.user._id,
      customerName,
      customerPhone,
      tableNumber,
      numberOfGuests,
      reservationTime: requestedTime,
      notes
    });
    await newReservation.save();
    res.status(201).json(newReservation);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// @route   PUT /api/reservations/:id
// @desc    Update reservation status
router.put('/:id', protect, async (req, res) => {
  try {
    const updatedReservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(updatedReservation);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// @route   DELETE /api/reservations/:id
// @desc    Delete a reservation
router.delete('/:id', protect, async (req: any, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Only admin/staff or the user who created it can delete it
    if (req.user.role !== 'admin' && req.user.role !== 'staff' && reservation.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Reservation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Reservation removed' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
