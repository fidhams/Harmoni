require("dotenv").config();
const express = require("express");
const cors = require('cors');
const http = require("http");
const { Server } = require("socket.io");


const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes"); //donor and donee sign up login
const orgRoutes = require("./routes/orgRoutes");
const volunteerRoutes = require("./routes/volunteerRoutes");
// const chatRoutes = require("./routes/chatRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const homeRoutes = require('./routes/homeRoutes');
const impactRoutes = require('./routes/impactRoutes'); //
const adminRoutes = require('./routes/adminRoutes'); //includes all admin conrols
const donorDashboardRoutes = require('./routes/donorDashboardRoutes'); //
const doneeDashboardRoutes = require('./routes/doneeDashboardRoutes');

const donationPageRoutes = require('./routes/DonationPageRoutes');
const volunteerPageRoutes = require('./routes/VolunteerPageRoutes');
const contactRoutes = require('./routes/contactRoutes');
const chatbotRoutes= require('./routes/chatbotRoutes');




const app = express();
const server = http.createServer(app);

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/admin', adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/organizations", orgRoutes);
app.use("/api/donor", donorDashboardRoutes);
app.use("/api/donee", doneeDashboardRoutes);
app.use("/uploads", express.static("uploads"));

app.use('/api/impact-stories', impactRoutes);
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/d", donationPageRoutes);
app.use("/api/v", volunteerPageRoutes);
app.use("/api/approved-donees", contactRoutes);
app.use("/api/chatbot", chatbotRoutes);

// Default route set to Home
app.use('/api', homeRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);



///chat implementation
const io = new Server(server, {
  cors: {
      origin: "http://localhost:3000", // Replace with your frontend URL
      methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.on("join_room", (room) => {
      socket.join(room);
      console.log(`User with ID: ${socket.id} joined room: ${room}`);
  });

  socket.on("send_message", (data) => {
      io.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
      console.log("User Disconnected:", socket.id);
  });
});













  // Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

