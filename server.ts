import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dns from 'dns';

dns.setServers(["1.1.1.1", "8.8.8.8"]);

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Models for Seeding
import MenuItem from './server/models/MenuItem.ts';
import Order from './server/models/Order.ts';
import Payment from './server/models/Payment.ts';
import Reservation from './server/models/Reservation.ts';

// Seed Data Function
const seedData = async () => {
  try {
    const menuCount = await MenuItem.countDocuments();
    if (menuCount === 0) {
      console.log('🌱 Seeding initial data...');
      const items = await MenuItem.insertMany([
        { name: 'Cappuccino', price: 450, category: 'Beverage', description: 'Rich espresso with steamed milk foam', stockQuantity: 50 },
        { name: 'Chocolate Cake', price: 650, category: 'Dessert', description: 'Decadent dark chocolate layer cake', stockQuantity: 15 },
        { name: 'Club Sandwich', price: 850, category: 'Snack', description: 'Classic triple-decker with chicken and egg', stockQuantity: 20 },
        { name: 'Iced Latte', price: 500, category: 'Beverage', description: 'Chilled espresso with cold milk', stockQuantity: 40 },
        { name: 'Blueberry Muffin', price: 350, category: 'Dessert', description: 'Freshly baked with real blueberries', stockQuantity: 12 }
      ]);

      const order1 = await new Order({
        customerName: 'Saman Kumara',
        tableNumber: 5,
        items: [{ menuItem: items[0]._id, quantity: 2, price: 450 }],
        totalAmount: 900,
        status: 'Paid',
        orderType: 'Dine-in'
      }).save();

      await new Payment({
        orderId: order1._id,
        amount: 900,
        paymentMethod: 'Cash',
        status: 'Completed'
      }).save();

      const order2 = await new Order({
        customerName: 'Nimali Perera',
        tableNumber: 3,
        items: [{ menuItem: items[2]._id, quantity: 1, price: 850 }],
        totalAmount: 850,
        status: 'Pending',
        orderType: 'Dine-in'
      }).save();

      await new Reservation({
        customerName: 'Kasun Kalhara',
        customerPhone: '0771234567',
        tableNumber: 10,
        reservationTime: new Date(Date.now() + 86400000),
        numberOfGuests: 4,
        status: 'Confirmed'
      }).save();

      console.log('✅ Database Seeded Successfully');
    }
  } catch (err) {
    console.error('❌ Seeding error:', err);
  }
};

// MongoDB Connection
// NOTE: If you see "ECONNREFUSED" locally, it's a DNS issue. 
// 1. Change your DNS to 8.8.8.8 (Google)
// 2. Or use the "Standard Connection String" (without +srv) from MongoDB Atlas
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://senitha_db_user:nD0htN4MehvHymWd@cluster0.kinvutx.mongodb.net/cafe_db?retryWrites=true&w=majority';

// Example of Standard Connection String (if SRV fails):
// const MONGODB_URI = 'mongodb://senitha_db_user:nD0htN4MehvHymWd@cluster0-shard-00-00.kinvutx.mongodb.net:27017,cluster0-shard-00-01.kinvutx.mongodb.net:27017,cluster0-shard-00-02.kinvutx.mongodb.net:27017/cafe_db?ssl=true&replicaSet=atlas-xxxxxx-shard-0&authSource=admin&retryWrites=true&w=majority';

let dbStatus = 'Disconnected';

console.log('⏳ Connecting to MongoDB Atlas...');
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
})
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas Successfully!');
    dbStatus = 'Connected';
    seedData();
  })
  .catch((err) => {
    dbStatus = `Error: ${err.message}`;
    console.error('❌ MongoDB Connection Error:', err.message);
  });

// Disable buffering to see errors immediately
mongoose.set('bufferCommands', false);

// API Routes
import authRoutes from './server/routes/auth.ts';
import menuRoutes from './server/routes/menu.ts';
import orderRoutes from './server/routes/order.ts';
import paymentRoutes from './server/routes/payment.ts';
import reservationRoutes from './server/routes/reservation.ts';
import feedbackRoutes from './server/routes/feedback.ts';

app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/feedback', feedbackRoutes);

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'CafeSync API is running',
    database: dbStatus 
  });
});

// Auth Routes (To be implemented)
// app.use('/api/auth', authRoutes);

// Vite Integration for Preview
async function setupVite() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }
}

setupVite().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
