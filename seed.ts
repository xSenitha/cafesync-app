import mongoose from 'mongoose';
import MenuItem from './server/models/MenuItem.ts';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://senitha_db_user:nD0htN4MehvHymWd@cluster0.kinvutx.mongodb.net/cafe_db?retryWrites=true&w=majority';

const seedData = [
  {
    name: 'Cappuccino',
    description: 'Rich espresso with steamed milk and a thick layer of foam.',
    price: 450,
    category: 'Beverage',
    stockQuantity: 50,
  },
  {
    name: 'Chocolate Cake',
    description: 'Moist chocolate cake with dark chocolate ganache.',
    price: 650,
    category: 'Dessert',
    stockQuantity: 10,
  },
  {
    name: 'Club Sandwich',
    description: 'Triple-decker sandwich with chicken, egg, and vegetables.',
    price: 850,
    category: 'Main Course',
    stockQuantity: 20,
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');
    
    await MenuItem.deleteMany({});
    await MenuItem.insertMany(seedData);
    
    console.log('✅ Seed data inserted successfully!');
    process.exit();
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
}

seed();
