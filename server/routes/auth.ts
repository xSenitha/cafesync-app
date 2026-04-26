import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.ts';
import { protect, adminOnly, managerOrAbove } from '../middleware/auth.ts';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a user
router.post('/register', async (req: any, res: any) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // First user is admin, others are customers by default
    const userCount = await User.countDocuments();
    const finalRole = userCount === 0 ? 'admin' : (role || 'customer');

    user = new User({ name, email, password, role: finalRole });
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
router.post('/login', async (req: any, res: any) => {
  const { email, password } = req.body;
  console.log(`🔑 [API] Login attempt: ${email}`);
  try {
    const user: any = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// @route   GET /api/auth/users
// @desc    Get all users (Manager or Admin only)
router.get('/users', protect, managerOrAbove, async (req: any, res: any) => {
  try {
    let users;
    if (req.user.role === 'admin') {
      users = await User.find().select('-password');
    } else {
      // Managers can only see staff and customers
      users = await User.find({ role: { $in: ['staff', 'customer'] } }).select('-password');
    }
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// @route   DELETE /api/auth/users/:id
// @desc    Delete a user (Admin only)
router.delete('/users/:id', protect, adminOnly, async (req: any, res: any) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// @route   PUT /api/auth/users/:id
// @desc    Update user role (Manager or Admin only)
router.put('/users/:id', protect, managerOrAbove, async (req: any, res: any) => {
  try {
    const { role } = req.body;
    const targetUser = await User.findById(req.params.id);
    
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Role management rules:
    // 1. Admin can change roles of everyone
    // 2. Manager can only change roles of Staff and Members (customer)
    // 3. Manager cannot change Admin roles
    
    if (req.user.role === 'manager') {
      if (targetUser.role === 'admin') {
        return res.status(403).json({ message: 'Managers cannot change Admin roles' });
      }
      if (!['staff', 'customer'].includes(role)) {
        return res.status(403).json({ message: 'Managers can only assign Staff or Member roles' });
      }
    }

    targetUser.role = role;
    await targetUser.save();
    
    const updatedUser = await User.findById(targetUser._id).select('-password');
    res.json(updatedUser);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
