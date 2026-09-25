const mongoose = require('mongoose');

const cabBookingSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  tripType: { type: String, required: true },
  pickup: { type: String, required: true },
  drop: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  passengers: { type: Number, required: true },
  carName: { type: String, required: true },
  estimatedFare: { type: Number, required: true },
  status: { type: String, default: 'Pending' }, // <-- Yeh add karein
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CabBooking', cabBookingSchema);