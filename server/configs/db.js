const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () =>
      console.log("Database Connected")
    );
    // Remove options like useNewUrlParser and useUnifiedTopology if you have them
    await mongoose.connect(process.env.MONGODB_URI + '/hotel-booking');
  } catch (error) {
    console.log("DB Connection Error:", error.message);
  }
};

module.exports = connectDB;
