// routes/hotelRoutes.js

const express = require("express");
const router = express.Router();

const protect = require("../middleware/protect");
const { registerHotel } = require("../controllers/hotelController");

router.post("/register", protect, registerHotel);

module.exports = router;
