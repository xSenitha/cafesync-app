import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  customerName: String,
  tableNumber: Number,
  items: [
    {
      menuItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItem',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      price: Number, // Price at the time of order
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Preparing', 'Ready', 'Served', 'Cancelled', 'Paid'],
    default: 'Pending',
  },
  orderType: {
    type: String,
    enum: ['Dine-in', 'Takeaway'],
    default: 'Dine-in',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Order', orderSchema);
