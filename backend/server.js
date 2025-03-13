require("dotenv").config();
const express = require("express");
const cors = require('cors');

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const orgRoutes = require("./routes/orgRoutes");
const donationRoutes = require("./routes/donationRoutes");
const volunteerRoutes = require("./routes/volunteerRoutes");
const chatRoutes = require("./routes/chatRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const homeRoutes = require('./routes/homeRoutes');
const impactRoutes = require('./routes/impactRoutes');


const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/organizations", orgRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/chat", chatRoutes);
app.use('/api/impact-stories', impactRoutes);

// Default route set to Home
app.use('/', homeRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
