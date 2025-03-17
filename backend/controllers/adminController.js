const Admin = require('../models/Admin');
const Donor = require("../models/donor");
const Donee = require("../models/donee");
const Donation = require("../models/Donation");
const Event = require("../models/Event");
const Need = require("../models/Needs");
const VolunteerRequest = require("../models/VolunteerRequest");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const addAdmin = async (req, res) => {
    try {
      const { email, password, passkey } = req.body;
      const key = "lbscek"; // Predefined passkey
  
      if (!email || !password || !passkey) {
        return res.status(400).json({ error: "All fields are required" });
      }
  
      if (passkey !== key) {
        return res.status(401).json({ error: "Invalid passkey" });
      }
  
      console.log("Creating new admin:", email);
  
      // Check if the admin already exists
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        return res.status(409).json({ error: "Admin already exists" });
      }
  
      // Hash password before saving
      const hashedPassword = await bcrypt.hash(password, 10);
      const admin = new Admin({ email, password: hashedPassword });
  
      await admin.save();
      console.log("Entered Password:", password);
      console.log("Stored Hashed Password:", admin.password);

  
      res.json({ message: "Admin created successfully", admin });
    } catch (error) {
      console.error("Error in addAdmin:", error.message);
      res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
  };
  

const adminController = {
    adminLogin: async (req, res) => {
      try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });
  
        if (!admin) {
          return res.status(404).json({ error: "Admin not found" });
        }
  
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
          return res.status(401).json({ error: "Invalid credentials" });
        }
  
        const token = jwt.sign({ id: admin._id, userRole: "admin" }, "your_secret_key", { expiresIn: "1h" });
        res.json({ token, admin });
      } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
      }
    },

    getAllAdmins: async (req, res) => {
        try {
          const admins = await Admin.find();
          res.json(admins);
        } catch (error) {
          res.status(500).json({ error: "Internal Server Error" });
        }
      },
  };

  const donorController = {
    getAllDonors: async (req, res) => {
      try {
        const donors = await Donor.find();
        if (!Array.isArray(donors)) {
          return res.status(500).json({ error: "Invalid response format" });
        }
        res.json(donors);
      } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
      }
    },
  
    getDonorById: async (req, res) => {
      const { email } = req.params;
      try {
        const donor = await Donor.findOne({ email });
        if (!donor) {
          return res.status(404).json({ error: "Donor not found" });
        }
        res.json(donor);
      } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
      }
    },
  };
  
  const doneeController = {
    getAllDonees: async (req, res) => {
      try {
        const donees = await Donee.find();
        if (!Array.isArray(donees)) {
          return res.status(500).json({ error: "Invalid response format" });
        }
        res.json(donees);
      } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
      }
    },
    getDoneeById: async (req, res) => {
      const { id } = req.params;
      try {
        const donee = await Donee.findById(id);
        if (!donee) {
          return res.status(404).json({ error: "Donee not found" });
        }
        res.json(donee);
      } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
      }
    },
  };




module.exports = { addAdmin, adminController, donorController, doneeController };
