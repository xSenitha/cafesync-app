import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

// Load environment variables
dotenv.config();

// Imports for routes
import authRoutes from './server/routes/auth.ts';
import menuRoutes from './server/routes/menu.ts';
import orderRoutes from './server/routes/order.ts';
import paymentRoutes from './server/routes/payment.ts';
import reservationRoutes from './server/routes/reservation.ts';
import feedbackRoutes from './server/routes/feedback.ts';
import tableRoutes from './server/routes/table.ts';

const app = express();
const PORT = 3000;

// 1. Basic Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// 2. Logger Middleware for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} [${req.method}] ${req.url}`);
  next();
});

// 3. API Routes (Registered BEFORE Vite/catch-all)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'CafeSync API is running',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/tables', tableRoutes);

// Fallback for missing API routes - must be BEFORE Vite
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    error: 'API Endpoint not found',
    path: req.originalUrl,
    method: req.method
  });
});

async function startServer() {
  console.log('🚀 Initializing CafeSync Management Suite...');

  // 4. Vite Integration for Front-end (Development)
  if (process.env.NODE_ENV !== 'production') {
    console.log('📦 Integrating Vite for development...');
    try {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
      console.log('✅ Vite middleware integrated');
    } catch (vErr) {
      console.error('❌ Vite integration failed:', vErr);
    }
  } else {
    console.log('🚀 Serving production build assets...');
    const distPath = path.join(process.cwd(), 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      // Standard SPA catch-all for production
      app.get('*', (req, res) => {
        // Only serve index.html if it's not an API route (though API routes should have matched above)
        if (!req.url.startsWith('/api')) {
          res.sendFile(path.join(distPath, 'index.html'));
        } else {
          res.status(404).json({ error: 'API route not found' });
        }
      });
    }
  }

  // 5. Global Error Handler
  app.use((err: any, req: any, res: any, next: any) => {
    console.error('💥 Unhandled Server Error:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  });

  // 6. Connect to MongoDB in background
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://senitha_db_user:nD0htN4MehvHymWd@cluster0.kinvutx.mongodb.net/cafe_db?retryWrites=true&w=majority';
  console.log('⏳ Connecting to MongoDB Atlas...');
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB Atlas'))
    .catch(err => console.error('❌ MongoDB Connection failed:', err.message));

  // 7. Start listener
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 CafeSync Server live at http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('💥 Critical Startup Error:', err);
});
