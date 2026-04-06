import express from 'express';
import Feedback from '../models/Feedback.ts';
import { protect } from '../middleware/auth.ts';

const router = express.Router();

// Get all feedback
router.get('/', async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 }).populate('user', 'name');
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching feedback' });
  }
});

// Create feedback
router.post('/', protect, async (req: any, res) => {
  try {
    const { orderId, rating, comment } = req.body;
    const newFeedback = new Feedback({
      user: req.user._id,
      customerName: req.user.name,
      orderId,
      rating,
      comment
    });
    const savedFeedback = await newFeedback.save();
    res.status(201).json(savedFeedback);
  } catch (err) {
    res.status(400).json({ message: 'Error creating feedback' });
  }
});

export default router;
