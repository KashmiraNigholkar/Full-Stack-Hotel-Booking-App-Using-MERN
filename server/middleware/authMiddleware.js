const jwt = require('jsonwebtoken');
const User = require('../models/User.js');

const protect = async (req, res, next) => {
  let token;
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({ success: false, message: "User not found" });
      }

      req.user = user;
      next();
    } else {
      return res.status(401).json({ success: false, message: "Not authorized, no token" });
    }
  } catch (error) {
    console.error("Error in protect middleware:", error);
    return res.status(401).json({ success: false, message: "Not authorized, token failed" });
  }
};

module.exports = protect; // ✅ This is a default export
