import express from 'express';
import Reservation from '../models/Reservation.ts';
import { protect } from '../middleware/auth.ts';

const router = express.Router();

// @route   GET /api/reservations
// @desc    Get all reservations
router.get('/', protect, async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.json(reservations);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/reservations
// @desc    Create a reservation
router.post('/', async (req, res) => {
  try {
    const newReservation = new Reservation(req.body);
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
