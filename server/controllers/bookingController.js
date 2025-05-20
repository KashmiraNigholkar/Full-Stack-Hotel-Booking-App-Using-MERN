const Booking = require('../models/Booking');
const Hotel = require('../models/Hotel');
const Room = require('../models/Room');

// Check room availability API
const checkAvailabilityAPI = async (req, res) => {
  try {
    const { hotelId, roomType, checkInDate, checkOutDate } = req.body;

    if (!hotelId || !roomType || !checkInDate || !checkOutDate) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);

    // Find all available rooms of given type in the hotel
    const rooms = await Room.find({ hotel: hotelId, roomType, isAvailable: true });

    if (!rooms.length) {
      return res.json({ success: true, available: false, message: "No rooms of this type available" });
    }

    // Check each room to see if it is free for the requested date range
    for (const room of rooms) {
      const overlappingBooking = await Booking.exists({
        room: room._id,
        status: { $ne: 'cancelled' },
        // Overlapping booking condition:
        // Existing booking check-in < requested check-out AND
        // Existing booking check-out > requested check-in
        checkInDate: { $lt: end },
        checkOutDate: { $gt: start }
      });

      if (!overlappingBooking) {
        // Found at least one free room
        return res.json({ success: true, available: true });
      }
    }

    // All rooms are booked for the requested dates
    res.json({ success: true, available: false, message: "No rooms available for the given dates" });

  } catch (err) {
    console.error("Check availability error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const { hotelId, roomId, checkInDate, checkOutDate, guests, paymentMethod } = req.body;
    const userId = req.user._id;

    if (!hotelId || !roomId || !checkInDate || !checkOutDate || !guests) {
      return res.status(400).json({ success: false, message: "Missing required booking fields" });
    }

    // Verify room exists and belongs to the hotel
    const room = await Room.findOne({ _id: roomId, hotel: hotelId });
    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found in the specified hotel" });
    }

    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);

    // Check for overlapping bookings that are not cancelled
    const isBooked = await Booking.exists({
      room: roomId,
      status: { $ne: 'cancelled' },
      checkInDate: { $lt: end },
      checkOutDate: { $gt: start }
    });

    if (isBooked) {
      return res.status(409).json({ success: false, message: "Room is already booked for the selected dates" });
    }

    // Calculate total price
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * room.pricePerNight;

    const booking = await Booking.create({
      user: userId,
      hotel: hotelId,
      room: roomId,
      checkInDate: start,
      checkOutDate: end,
      guests,
      totalPrice,
      paymentMethod: paymentMethod || "Pay At Hotel",
      isPaid: false,
      status: "pending",
    });

    res.status(201).json({ success: true, booking });

  } catch (err) {
    console.error("Create booking error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get bookings for a user
const getUserBookings = async (req, res) => {
  try {
    const userId = req.user._id;
    const bookings = await Booking.find({ user: userId })
      .populate('hotel')
      .populate('room')
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });

  } catch (err) {
    console.error("Get user bookings error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get bookings for hotels owned by the user
const getHotelBookings = async (req, res) => {
  try {
    const ownerId = req.user._id;

    // Find all hotels owned by this user
    const hotels = await Hotel.find({ owner: ownerId }).select('_id');
    const hotelIds = hotels.map(h => h._id);

    // Find bookings for these hotels
    const bookings = await Booking.find({ hotel: { $in: hotelIds } })
      .populate('user')
      .populate('room')
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });

  } catch (err) {
    console.error("Get hotel bookings error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  checkAvailabilityAPI,
  createBooking,
  getUserBookings,
  getHotelBookings,
};
