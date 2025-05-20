const Hotel = require('../models/Hotel');
const Room = require('../models/Room');
const cloudinary = require('cloudinary').v2;

// Create a new room for a hotel
const createRoom = async (req, res) => {
  try {
    const { roomType, pricePerNight, amenities } = req.body;
    const ownerId = req.user._id; // from auth middleware

    // Find the hotel belonging to the authenticated owner
    const hotel = await Hotel.findOne({ owner: ownerId });
    if (!hotel) {
      return res.status(404).json({ success: false, message: 'No hotel found for this owner' });
    }

    // Validate required fields
    if (!roomType || !pricePerNight || !amenities || !req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Missing required room fields or images' });
    }

    // Upload images to Cloudinary
    const uploadPromises = req.files.map((file) =>
      cloudinary.uploader.upload(file.path).then((resp) => resp.secure_url)
    );
    const images = await Promise.all(uploadPromises);

    // Parse amenities (expecting a JSON string)
    let parsedAmenities;
    try {
      parsedAmenities = JSON.parse(amenities);
    } catch {
      return res.status(400).json({ success: false, message: 'Amenities must be a valid JSON array' });
    }

    // Create room document
    await Room.create({
      hotel: hotel._id,
      roomType,
      pricePerNight: Number(pricePerNight),
      amenities: parsedAmenities,
      images,
      isAvailable: true, // Default to available
    });

    return res.status(201).json({ success: true, message: 'Room created successfully' });
  } catch (error) {
    console.error('Create Room Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get all available rooms
const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ isAvailable: true })
      .populate({
        path: 'hotel',
        populate: { path: 'owner', select: 'image' },
      })
      .sort({ createdAt: -1 });

    return res.json({ success: true, rooms });
  } catch (error) {
    console.error('Get Rooms Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get rooms for the authenticated hotel owner
const getOwnerRooms = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const hotel = await Hotel.findOne({ owner: ownerId });
    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found' });
    }
    const rooms = await Room.find({ hotel: hotel._id }).populate('hotel');
    return res.json({ success: true, rooms });
  } catch (error) {
    console.error('Get Owner Rooms Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Toggle room availability
const toggleRoomAvailability = async (req, res) => {
  try {
    const { roomId } = req.body;
    if (!roomId) {
      return res.status(400).json({ success: false, message: 'roomId is required' });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    room.isAvailable = !room.isAvailable;
    await room.save();

    return res.json({ success: true, message: 'Room availability updated', isAvailable: room.isAvailable });
  } catch (error) {
    console.error('Toggle Room Availability Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createRoom,
  getRooms,
  getOwnerRooms,
  toggleRoomAvailability,
};
