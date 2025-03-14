const Donor = require("../models/donor");
const Donee = require("../models/donee");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const express = require("express");

const app = express();
app.use(express.json());


const donorsignup = async (req, res) => {
    try {
      const { name, email, password, phone } = req.body;
      const user = await Donor.findOne({ email });
      if (!user) return res.status(400).json({ message: "User already exists" });
      const donor = new Donor({ name, email, password, phone });
      await donor.save();
      res.status(201).json({ message: "Donor registered successfully!" });
    } catch (error) {
      res.status(500).json({ error: "Error signing up" });
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
      const { name, email, password, phone } = req.body;
      const donee = new Donee({ name, email, password, phone });
      const user = await Donee.findOne({ email });
        if (!user) return res.status(400).json({ message: "User already exists" });
      await donee.save();
      res.status(201).json({ message: "Registration Application Submitted. Wait for approval" });
    } catch (error) {
      res.status(500).json({ error: "Error signing up" });
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
