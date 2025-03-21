const express = require("express");
const router = express.Router();
const Needs = require("../models/Needs");
const Donation = require("../models/Donation");

router.get("/needs",  async (req, res) => {
    try {
      const needs = await Needs.find({ fulfilled: false }).populate("donee", "name"); // Populating donee name
      res.json(needs);
    } catch (error) {
      console.error("Error fetching needs:", error.message);
      res.status(500).json({ error: "Server Error" });
    }
});

router.get("/don", async (req, res) => {
    try {
      const donations = await Donation.find({ status: "completed" })
        .populate("donor", "name")
        .populate("organization", "name"); // Populate donor and organization names
  
      res.json(donations);
    } catch (error) {
      res.status(500).json({ error: "Server Error" });
    }
});

module.exports = router;