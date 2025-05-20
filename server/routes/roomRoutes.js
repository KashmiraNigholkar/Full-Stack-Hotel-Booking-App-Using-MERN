const express = require("express");
const {
  createRoom,
  getOwnerRooms,
  getRooms,
  toggleRoomAvailability,
} = require("../controllers/roomController");
const upload = require("../middleware/uploadMiddleware");
const { protect } = require("../middleware/authMiddleware");

const roomRouter = express.Router();

// Authenticate first, then handle file uploads
roomRouter.post(
  "/",
  protect,
  upload.array("images", 4),
  createRoom
);

roomRouter.get("/", getRooms);

roomRouter.get("/owner", protect, getOwnerRooms);

roomRouter.post("/toggle-availability", protect, toggleRoomAvailability);

module.exports = roomRouter;
