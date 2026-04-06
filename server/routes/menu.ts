import express from 'express';
import multer from 'multer';
import path from 'path';
import MenuItem from '../models/MenuItem.ts';
import { protect, adminOnly, managerOrAbove, staffOrAbove } from '../middleware/auth.ts';

const router = express.Router();

// Multer Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only images are allowed!'));
  },
});

// @route   GET /api/menu
// @desc    Get all menu items
router.get('/', async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.json(items);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/menu
// @desc    Add a menu item (Staff or Above)
router.post('/', protect, staffOrAbove, upload.single('image'), async (req: any, res: any) => {
  try {
    const { name, description, price, category, stockQuantity, imageUrl: bodyImageUrl } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : (bodyImageUrl || '');

    const newItem = new MenuItem({
      name,
      description,
      price,
      category,
      stockQuantity,
      imageUrl,
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// @route   PUT /api/menu/:id
// @desc    Update a menu item (Staff or Above)
router.put('/:id', protect, staffOrAbove, upload.single('image'), async (req: any, res: any) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.imageUrl) {
      updateData.imageUrl = req.body.imageUrl;
    }

    const updatedItem = await MenuItem.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updatedItem);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// @route   PATCH /api/menu/:id
// @desc    Partially update a menu item (Staff or Above)
router.patch('/:id', protect, staffOrAbove, async (req: any, res: any) => {
  try {
    const updatedItem = await MenuItem.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(updatedItem);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// @route   DELETE /api/menu/:id
// @desc    Delete a menu item (Manager or Admin only)
router.delete('/:id', protect, managerOrAbove, async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
