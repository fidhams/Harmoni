const Donor = require("../models/donor");
const Donee = require("../models/donee");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const express = require("express");


const app = express();
app.use(express.json());


const donorsignup = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ error: "All required fields must be filled." });
    }

    const existingDonor = await Donor.findOne({ email });
    if (existingDonor) {
      return res.status(409).json({ error: "Email already exists" });
    }

    const newDonor = new Donor({ name, email, password, phone, address });
    await newDonor.save();

    res.status(201).json({ message: "Signup successful", donor: newDonor });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

const donorlogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const donor = await Donor.findOne({ email });

    if (!donor) {
      return res.status(404).json({ error: "Donor not found" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, donor.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: donor._id, userRole: "donor" }, process.env.JWT_SECRET, { expiresIn: "5h" });

    res.json({ token, donor }); // ✅ Ensure token and donor are both sent

  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const doneesignup = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ error: "All required fields must be filled." });
    }

    const existingDonee = await Donee.findOne({ email });
    if (existingDonee) {
      return res.status(409).json({ error: "Email already exists" });
    }

    const newDonee = new Donee({ name, email, password, phone, address });
    await newDonee.save();

    res.status(201).json({ message: "Application Submitted. Wait for Approval.", donee: newDonee });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

const doneelogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const donee = await Donee.findOne({ email });

    if (!donee) {
      return res.status(404).json({ error: "Donee not found" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, donee.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check if the donee is verified
    if (!donee.verified) {
      return res.status(403).json({ error: "Your account is not verified. Please contact an admin." });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: donee._id, userRole: "donee" }, "your_secret_key", { expiresIn: "5h" });

    res.json({ token, donee });

  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = { donorlogin, donorsignup, doneelogin, doneesignup };
