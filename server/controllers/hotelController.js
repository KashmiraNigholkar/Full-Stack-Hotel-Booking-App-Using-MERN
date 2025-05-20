// controllers/hotelController.js

const Hotel = require("../models/Hotel");
const User = require("../models/User");

const registerHotel = async (req, res) => {
  try {
    // Ensure user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const { name, address, contact, city } = req.body;

    // Validate required fields
    if (!name || !address || !contact || !city) {
      return res.status(400).json({ success: false, message: "Please provide all required hotel details" });
    }

    const owner = req.user._id;

    // Check if user already owns a hotel
    const existingHotel = await Hotel.findOne({ owner });
    if (existingHotel) {
      return res.status(409).json({ success: false, message: "Hotel already registered by this user" });
    }

    // Create the hotel
    await Hotel.create({ name, address, contact, city, owner });

    // Update the user's role
    await User.findByIdAndUpdate(owner, { role: "hotelOwner" });

    res.status(201).json({ success: true, message: "Hotel registered successfully" });
  } catch (error) {
    console.error("Hotel registration error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { registerHotel };
