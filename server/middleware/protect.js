const User = require("../models/User");

// Dummy protect middleware — replace with real auth in production
const protect = async (req, res, next) => {
  try {
    const userId = req.header("x-user-id");
    if (!userId) {
      return res.status(401).json({ success: false, message: "No user ID provided" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Not authorized" });
  }
};

module.exports = { protect };
