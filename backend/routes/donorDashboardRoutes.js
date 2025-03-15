const express = require("express");
const multer = require("multer");
const path = require("path");
const Donation = require("../models/Donation");
const Donor = require("../models/donor");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Fetch donor dashboard details
router.get("/dashboard", authenticate, async (req, res) => {
  try {
    console.log("user:", req.user);
    const donor = await Donor.findById(req.user.id).populate("donations");
    res.json(donor);
    if (!donor) {
      return res.status(404).json({ error: "Donor not found" });
    }
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Post a new donation
router.post("/post-donation", authenticate, upload.single("image"), async (req, res) => {
  try {
    const { item, category, quantity, description } = req.body;
    const newDonation = new Donation({
      donor: req.user.id,
      item,
      category,
      quantity,
      description,
      image: req.file ? req.file.filename : null,
    });
    const savedDonation = await newDonation.save();

    // ✅ Now, update the donor's `donations` array
    await Donor.findByIdAndUpdate(req.user.id, {
    $push: { donations: savedDonation._id }
    });
    } catch (error) {
        res.status(500).json({ error: "Error posting donation" });
    }
});

// Delete a donation (only if status is pending)
router.delete("/delete-donation/:id", authenticate, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ error: "Donation not found" });
    }
    if (donation.status !== "pending") {
      return res.status(400).json({ error: "Cannot delete accepted/completed donations" });
    }
    await donation.remove();
    res.json({ message: "Donation deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting donation" });
  }
});

module.exports = router;
