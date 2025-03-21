require("dotenv").config();
const express = require("express");
const cors = require('cors');


const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes"); //donor and donee sign up login
const orgRoutes = require("./routes/orgRoutes");
const volunteerRoutes = require("./routes/volunteerRoutes");
const chatRoutes = require("./routes/chatRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const homeRoutes = require('./routes/homeRoutes');
const impactRoutes = require('./routes/impactRoutes'); //
const adminRoutes = require('./routes/adminRoutes'); //includes all admin conrols
const donorDashboardRoutes = require('./routes/donorDashboardRoutes'); //
const doneeDashboardRoutes = require('./routes/doneeDashboardRoutes');

const donationPageRoutes = require('./routes/DonationPageRoutes');

// const FAQ = require("./models/FAQ");



const app = express();

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
app.use("/api/chat", chatRoutes);
app.use('/api/impact-stories', impactRoutes);
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/d", donationPageRoutes);

// Default route set to Home
app.use('/', homeRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);



// io.on("connection", (socket) => {
//     console.log("User connected");
  
//     socket.on("userMessage", async (message) => {
//       try {
//         // First, check if the question is in the database
//         const faq = await FAQ.findOne({ question: { $regex: new RegExp(message, "i") } });
  
//         if (faq) {
//           socket.emit("botMessage", faq.answer);
//         } else {
//           // If no FAQ, ask Hugging Face model
//           const response = await axios.post(
//             `https://api-inference.huggingface.co/models/${MODEL_NAME}`,
//             { inputs: `Website Info: ${siteInfo}\nUser: ${message}` },
//             {
//               headers: { Authorization: `Bearer ${HF_API_KEY}` },
//             }
//           );
  
//           const botMessage = response.data.generated_text || "I'm not sure about that. Can you try rephrasing?";
//           socket.emit("botMessage", botMessage);
//         }
//       } catch (error) {
//         console.error("Error with Hugging Face:", error);
//         socket.emit("botMessage", "Sorry, I couldn't process that right now.");
//       }
//     });
  
//     socket.on("disconnect", () => {
//       console.log("User disconnected");
//     });
//   });












  // Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

