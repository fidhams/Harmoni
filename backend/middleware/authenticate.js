const jwt = require("jsonwebtoken");
const Donor = require("../models/donor"); // Ensure correct model import
const dotenv = require("dotenv");

dotenv.config();

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log("Auth Header:", authHeader); // Debugging

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded); // Debugging

    req.user = await Donor.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ error: "User not found" });
    }

    next();
  } catch (error) {
    console.error("JWT Error:", error);
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = authenticate;
