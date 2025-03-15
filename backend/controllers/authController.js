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
    
        if (!donor || !(await bcrypt.compare(password, donor.password))) {
          return res.status(400).json({ message: "Invalid credentials" });
        }
    
        const token = jwt.sign({ donorId: donor._id }, "SECRET_KEY", { expiresIn: "1h" });
        res.json({ message: "Login successful!", token });
      } catch (error) {
        res.status(500).json({ error: "Error logging in" });
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
  
      if (!donee || !(await bcrypt.compare(password, donee.password))) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
  
      const token = jwt.sign({ doneeId: donee._id }, "SECRET_KEY", { expiresIn: "1h" });
      res.json({ message: "Login successful!", token });
    } catch (error) {
      res.status(500).json({ error: "Error logging in" });
    }
};


module.exports = { donorlogin, donorsignup, doneelogin, doneesignup };
