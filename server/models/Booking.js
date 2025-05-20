const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
  checkInDate: { type: Date, required: true },
  checkOutDate: { 
    type: Date, 
    required: true,
    validate: {
      validator: function(value) {
        // checkOutDate must be greater than checkInDate
        return value > this.checkInDate;
      },
      message: 'Check-out date must be after check-in date'
    }
  },
  totalPrice: { type: Number, required: true, min: 0 },
  guests: { type: Number, required: true, min: 1 },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    enum: ['Pay At Hotel', 'Credit Card', 'Debit Card', 'Paypal', 'Other'], // example payment methods
    default: 'Pay At Hotel',
    required: true,
    trim: true,
  },
  isPaid: { type: Boolean, default: false },
}, {
  timestamps: true,
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
