const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  _id: {
    type: String,      // Clerk user IDs are strings, used as _id here
    required: true,
  },
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,       // optional, if you want unique usernames
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,       // optional, enforce unique emails
  },
  image: {
    type: String,
    trim: true,
  },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
