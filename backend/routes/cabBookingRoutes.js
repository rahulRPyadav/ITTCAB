const express = require('express');
const router = express.Router();
const CabBooking = require('../models/CabBooking');

// POST: Save Cab Booking
router.post('/', async (req, res) => {
  try {
    const newBooking = new CabBooking(req.body);
    await newBooking.save();
    res.status(201).json({ success: true, message: 'Cab booked successfully', data: newBooking });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET: Fetch all Cab Bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await CabBooking.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT: Update Booking Status (Confirm / Cancel)
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedBooking = await CabBooking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updatedBooking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.status(200).json({ success: true, message: 'Status updated', data: updatedBooking });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE: Delete Cab Booking permanently
router.delete('/:id', async (req, res) => {
  try {
    const deletedBooking = await CabBooking.findByIdAndDelete(req.params.id);
    if (!deletedBooking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.status(200).json({ success: true, message: 'Booking deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;