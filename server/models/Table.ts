import mongoose from 'mongoose';

const tableSchema = new mongoose.Schema({
  number: { type: Number, required: true, unique: true },
  capacity: { type: Number, default: 4 },
  status: { type: String, enum: ['Available', 'Occupied', 'Reserved'], default: 'Available' }
}, { timestamps: true });

export default mongoose.model('Table', tableSchema);
