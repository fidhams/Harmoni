const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Donation = require("../models/Donation");
const Donor = require("../models/donor");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

// ✅ Ensure `uploads/` directory exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// 📸 Multer setup for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// 🏠 Fetch donor dashboard details
router.get("/dashboard", authenticate, async (req, res) => {
  try {
    console.log("User ID:", req.user?.id);

    // Ensure user ID is valid before querying
    if (!req.user?.id) {
      return res.status(400).json({ error: "Invalid request. User not authenticated." });
    }

    const donor = await Donor.findById(req.user.id).populate("donations");

    if (!donor) {
      return res.status(404).json({ error: "Donor not found" });
    }

    return res.status(200).json(donor); // ✅ Send structured response with status 200

  } catch (error) {
    console.error("Error fetching donor dashboard:", error);
    res.status(500).json({ error: "Internal server error. Please try again later." });
  }
});


// 🎁 Post a new donation
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

    console.log("Uploaded File:", req.file);
    const savedDonation = await newDonation.save();

    // ✅ Update the donor's `donations` array
    await Donor.findByIdAndUpdate(req.user.id, {
      $push: { donations: savedDonation._id },
    });


    // ✅ Send success response
    res.status(201).json({ message: "Donation posted successfully", donation: savedDonation });
  } catch (error) {
    console.error("Error posting donation:", error);
    res.status(500).json({ error: "Error posting donation" });
  }
});

// ❌ Delete a donation (only if status is pending)
router.delete("/delete-donation/:id", authenticate, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    
    if (!donation) {
      return res.status(404).json({ error: "Donation not found" });
    }
    
    if (donation.status !== "pending") {
      return res.status(400).json({ error: "Cannot delete accepted/completed donations" });
    }

    // ✅ Delete the image file if it exists
    if (donation.image) {
      const imagePath = path.join(__dirname, "../uploads", donation.image);
      fs.unlink(imagePath, (err) => {
        if (err && err.code !== "ENOENT") {
          console.error("Error deleting image file:", err);
        }
      });
    }

    // ✅ Delete the donation entry from MongoDB
    await Donation.findByIdAndDelete(req.params.id);

    res.json({ message: "Donation and associated image deleted successfully" });
  } catch (error) {
    console.error("Error deleting donation:", error);
    res.status(500).json({ error: "Error deleting donation" });
  }
});

// ✅ GET Donor Profile
router.get("/profile", authenticate, async (req, res) => {
  try {
    const donor = await Donor.findById(req.user.id).select("-password");
    if (!donor) {
      return res.status(404).json({ error: "Donor not found" });
    }
    res.json(donor);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ UPDATE Donor Profile
router.put("/edit-profile", authenticate, async (req, res) => {
  try {
    const { name, password, address, phone, skills } = req.body;

    // Fetch donor
    let donor = await Donor.findById(req.user.id);
    if (!donor) {
      return res.status(404).json({ error: "Donor not found" });
    }

    // Update allowed fields
    donor.name = name || donor.name;
    donor.address = address || donor.address;
    donor.phone = phone || donor.phone;
    
    // Update skills (ensuring it's an array)
    if (Array.isArray(skills)) {
      donor.skills = skills;
    }

    // Hash password if changed
    if (password) {
      donor.password = await bcrypt.hash(password, 10);
    }

    await donor.save();
    res.json({ message: "Profile updated successfully", donor });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Server error" });
  }
});



module.exports = router;
