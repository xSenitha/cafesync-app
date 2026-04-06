import express from 'express';
import Reservation from '../models/Reservation.ts';
import { protect } from '../middleware/auth.ts';

const router = express.Router();

// @route   GET /api/reservations
// @desc    Get all reservations
router.get('/', protect, async (req: any, res) => {
  try {
    let query = {};
    if (req.user.role === 'customer') {
      query = { user: req.user._id };
    }
    const reservations = await Reservation.find(query).sort({ reservationTime: 1 });
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
    const newReservation = new Reservation({
      user: req.user._id,
      customerName,
      customerPhone,
      tableNumber,
      numberOfGuests,
      reservationTime,
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

export default router;
