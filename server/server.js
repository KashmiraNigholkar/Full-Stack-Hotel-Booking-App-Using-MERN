const express = require("express");
require("dotenv").config();
const cors = require("cors");
const connectDB = require("./configs/db.js");
const { clerkMiddleware } = require('@clerk/express');

const clerkWebhooks = require('./controllers/clerkWebhooks.js');
const userRouter = require('./routes/userRoutes.js');
const hotelRouter = require('./routes/hotelRoutes.js');
const connectCloudinary = require('./configs/cloudinary.js');
const bookingRouter = require('./routes/bookingRoutes.js');
const roomRouter = require('./routes/roomRoutes.js');

// Connect to DB and Cloudinary
connectDB();
connectCloudinary();

const app = express();

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

// Routes
app.use("/api/clerk", clerkWebhooks);
app.use('/api/user', userRouter);
app.use('/api/hotels', hotelRouter);
app.use('/api/rooms', roomRouter);
app.use('/api/bookings', bookingRouter);

app.get('/', (req, res) => res.send("API is working fine."));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
