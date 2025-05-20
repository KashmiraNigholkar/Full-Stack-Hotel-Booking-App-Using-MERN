// routes/bookingRoutes.js
const express = require('express');
const {
  checkAvailabilityAPI,
  createBooking,
  getUserBookings,
  getHotelBookings,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

const bookingRouter = express.Router();

// Public route - check room availability
bookingRouter.post('/check-availability', checkAvailabilityAPI);

// Protected routes - user must be authenticated
bookingRouter.post('/book', protect, createBooking);
bookingRouter.get('/user', protect, getUserBookings);
bookingRouter.get('/hotel', protect, getHotelBookings);

module.exports = bookingRouter;
