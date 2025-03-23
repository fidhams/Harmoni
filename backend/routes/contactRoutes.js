const express = require("express");
const router = express.Router();
const Donee = require("../models/donee");



router.get("/", async (req, res) => {
  try {
    const donees = await Donee.find({verified: true});
    res.json(donees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;