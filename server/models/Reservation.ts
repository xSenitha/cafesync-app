import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  customerPhone: {
    type: String,
    required: true,
  },
  tableNumber: {
    type: Number,
    required: true,
  },
  numberOfGuests: {
    type: Number,
    required: true,
  },
  reservationDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Confirmed', 'Cancelled', 'Completed'],
    default: 'Confirmed',
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Reservation', reservationSchema);
