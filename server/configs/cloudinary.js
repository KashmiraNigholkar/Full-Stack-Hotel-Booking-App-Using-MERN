// configs/cloudinary.js (CommonJS)
const cloudinary = require('cloudinary').v2;

const connectCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true, // recommended to use HTTPS for URLs
  });

  console.log('Cloudinary configured.');
};

module.exports = connectCloudinary;
