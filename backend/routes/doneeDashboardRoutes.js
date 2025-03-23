const express = require("express");
const router = express.Router();
const Donee = require("../models/donee");
const Event = require("../models/Event");
const Needs = require("../models/Needs");
const Donation = require("../models/Donation");
const ImpactStory = require("../models/ImpactStory")
const { protect } = require("../middleware/authMiddleware");
const bcrypt = require("bcrypt");


const multer = require("multer");
const path = require("path");

// Set up storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/"); // Store files in 'uploads' folder
    },
    filename: (req, file, cb) => {
      cb(null,`${Date.now()}-${file.originalname}`); // Save with user ID
    },
  });
  const upload = multer({ storage });



// Fetch Donee Dashboard Data
router.get("/dashboard", protect, async (req, res) => {
  try {
    const donee = await Donee.findById(req.user.id)
      .populate("Event")
      .populate("Needs")
      .populate("ImpactStory");

    if (!donee) return res.status(404).json({ message: "Donee not found" });

    res.json({
      profile: donee,
      Event: donee.Event,
      Needs: donee.Needs,
      ImpactStory: donee.ImpactStory,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});




// Update Donee Profile
router.put("/profile", protect, upload.single("profileImage"), async (req, res) => {
  try {
    const donee = await Donee.findById(req.user.id);
    if (!donee) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields
    if (req.body.name) donee.name = req.body.name;
    if (req.body.phone) donee.phone = req.body.phone;
    if (req.body.address) donee.address = req.body.address;
    if (req.body.description) donee.description = req.body.description;

    // Update Location
    if (req.body.latitude && req.body.longitude) {
      donee.location = {
        type: "Point",
        coordinates: [req.body.longitude, req.body.latitude], // GeoJSON format
      };
    }

    if (req.body.latitude && req.body.longitude) {
      const lat = parseFloat(req.body.latitude);
      const lng = parseFloat(req.body.longitude);
      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        return res.status(400).json({ message: "Invalid latitude or longitude" });
      }
      donee.location = {
        type: "Point",
        coordinates: [lng, lat],
      };
    }
    

    // Update Password (if provided)
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      donee.password = await bcrypt.hash(req.body.password, salt);
    }

    // Update Profile Image (if provided)
    if (req.file) {
      donee.profileImage = req.file.filename;
    }

    await donee.save();
    res.json({ message: "Profile updated successfully", profile: donee });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error });
  }
});
  
///////////////////////////////////////////////EVENT////////////////////////////////////////////
//  Add Event
router.post("/event", protect, async (req, res) => {
  try {
    // Create new event with correct field name
    const event = new Event({
      ...req.body,
      description: req.body.description.replace(/\r\n/g, "\n"), // Normalize line breaks
      donee: req.user.id, // Correct field instead of createdBy
    });

    await event.save();

    // Update Donee model to include event ID if there's an event array in Donee schema
    await Donee.findByIdAndUpdate(req.user.id, { $push: { Event: event._id } });

    res.status(201).json(event);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Error creating event", error: error.message });
  }
});

// Delete Event
router.delete("/event/:id", protect, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    await Donee.findByIdAndUpdate(req.user.id, { $pull: { Event: req.params.id } });
    res.json({ message: "Event deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting event" });
  }
});


// Get a single event by ID
router.get("/event/:eventId", protect, async (req, res) => {
    try {
      const { eventId } = req.params;
  
      // Find event by ID
      const event = await Event.findById(eventId);
      
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
  
      res.status(200).json(event); // Send event details
    } catch (error) {
      console.error("Error fetching event:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

// Edit Event
router.put("/event/:id", protect, async (req, res) => {
    try {
      const { name, date, venue, description, volunteerRequest } = req.body;
  
      // Convert volunteerRequest to Boolean
      const isVolunteerRequest = volunteerRequest === "Yes";
  
      const updatedEvent = await Event.findByIdAndUpdate(
        req.params.id,
        {
          name,
          date,
          venue,
          description: description.replace(/\r\n/g, "\n"), // Normalize line breaks
          volunteerRequest: isVolunteerRequest, // Ensure boolean value
        },
        { new: true, runValidators: true }
      );
  
      if (!updatedEvent) {
        return res.status(404).json({ message: "Event not found" });
      }
  
      res.json(updatedEvent);
    } catch (error) {
      console.error("Error updating event:", error);
      res.status(500).json({ message: "Error updating event", error: error.message });
    }
  });
  
  
  
  


//////////////////////////////////////////////////NEEDS//////////////////////////////////////////////
// Add Donation Need
// router.post("/needs", protect, async (req, res) => {
//   try {
//     const need = new Needs({ ...req.body, createdBy: req.user.id });
//     await need.save();
//     await Donee.findByIdAndUpdate(req.user.id, { $push: { Needs: need._id } });
//     res.status(201).json(need);
//   } catch (error) {
//     res.status(500).json({ message: "Error creating need" });
//   }
// });

// Add a new need
router.post("/needs", protect, async (req, res) => {
  try {
    const { itemName, category, quantity, description } = req.body;

    const newNeed = new Needs({
      donee: req.user.id,
      itemName,
      category,
      quantity,
      description,
    });

    await newNeed.save();

    await Donee.findByIdAndUpdate(
      req.user.id,
      { $push: { Needs: newNeed._id } },
      { new: true }
    );
    
    res.status(201).json(newNeed);
  } catch (error) {
    console.error("Error adding need:", error);
    res.status(500).json({ message: "Error adding need", error: error.message });
  }
});

// Get need by ID
router.get("/needs/:id", protect, async (req, res) => {
  try {
    const need = await Needs.findById(req.params.id);
    if (!need) return res.status(404).json({ message: "Need not found" });
    res.json(need);
  } catch (error) {
    console.error("Error fetching need:", error);
    res.status(500).json({ message: "Error fetching need", error: error.message });
  }
});

// Update a need
router.put("/needs/:id", protect, async (req, res) => {
  try {
    const { itemName, category, quantity, description, fulfilled } = req.body;

    const updatedNeed = await Needs.findByIdAndUpdate(
      req.params.id,
      { itemName, category, quantity, description, fulfilled },
      { new: true, runValidators: true }
    );

    if (!updatedNeed) return res.status(404).json({ message: "Need not found" });

    res.json(updatedNeed);
  } catch (error) {
    console.error("Error updating need:", error);
    res.status(500).json({ message: "Error updating need", error: error.message });
  }
});

// Delete Need
router.delete("/needs/:id", protect, async (req, res) => {
  try {
    const need = await Needs.findById(req.params.id);
    if (!need) return res.status(404).json({ message: "Need not found" });

    if (need.donee.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to delete this need" });
    }

    await Needs.findByIdAndDelete(req.params.id);

    // Remove need ID from the donee's 'needs' array
    await Donee.findByIdAndUpdate(req.user.id, {
      $pull: { Needs: req.params.id },
    });

    res.json({ message: "Need deleted successfully" });
  } catch (error) {
    console.error("Error deleting need:", error);
    res.status(500).json({ message: "Error deleting need", error: error.message });
  }
});



/////////////////////////////////////////////////IMPACT STORIES///////////////////////////////////////////
// ✅ Add Impact Story
router.post("/story", protect, upload.single("image"), async (req, res) => {
  try {
    const { title, description } = req.body;
    const doneeId = req.user.id; // Assuming you get donee ID from authentication middleware

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const newStory = new ImpactStory({
      doneeId,
      title,
      description,
      image: req.file.filename, // Stores filename
    });

    const savedStory = await newStory.save();

    // Push story to Donee schema
    await Donee.findByIdAndUpdate(doneeId, { $push: { ImpactStory: savedStory._id } });

    res.status(201).json(savedStory);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Edit Impact Story
router.put("/story/:id", protect, upload.single("image"), async (req, res) => {
  try {
    const { title, description } = req.body;
    let updateData = { title, description };

    if (req.file) {
      updateData.image = req.file.filename;
    }

    const updatedStory = await ImpactStory.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!updatedStory) {
      return res.status(404).json({ message: "Impact Story not found" });
    }

    res.status(200).json(updatedStory);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Delete Impact Story
router.delete("/story/:id", protect, async (req, res) => {
  try {
    const impactStory = await ImpactStory.findByIdAndDelete(req.params.id);

    if (!impactStory) {
      return res.status(404).json({ message: "Impact Story not found" });
    }

    // Remove story reference from Donee schema
    await Donee.findByIdAndUpdate(impactStory.doneeId, { $pull: { ImpactStory: impactStory._id } });

    res.status(200).json({ message: "Impact Story deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

//get story by id
router.get("/storybyid/:id", protect, async (req, res) => {
  try{
    const story = await ImpactStory.findById(req.params.id);
    res.status(200).json(story);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
})

// ✅ Get Impact Stories for a Donee
router.get("/story/:doneeId", protect, async (req, res) => {
  try {
    const stories = await ImpactStory.find({ doneeId: req.params.doneeId });
    res.status(200).json(stories);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// Fetch donations: Show pending ones or those assigned to the logged-in donee
router.get("/donations", protect, async (req, res) => {
  try {
      const doneeId = req.user.id;

      // Get pending donations OR donations assigned to this donee
      const donations = await Donation.find({
          $or: [
              { status: "pending" }, 
              { status: { $ne: "pending" }, organization: doneeId }
          ]
      }).populate("donor", "name").populate("organization", "name");

      res.json(donations);
  } catch (error) {
      console.error("Error fetching donations:", error);
      res.status(500).json({ error: "Server error" });
  }
});

// Update donation status
router.put("/donation/:id", protect, async (req, res) => {
  try {
      const { status } = req.body;
      const doneeId = req.user.id;
      const donation = await Donation.findById(req.params.id);

      if (!donation) return res.status(404).json({ error: "Donation not found" });

      // Handle status updates with donee assignment logic
      if (status === "accepted" && donation.status === "pending") {
          donation.status = "accepted";
          donation.organization = doneeId; // Assign the donee
      } else if (status === "pending" && donation.status === "accepted") {
          donation.status = "pending";
          donation.organization = null; // Remove the donee
      } else if (status === "completed" && donation.status === "accepted") {
          donation.status = "completed";
      } else if (status === "accepted" && donation.status === "completed") {
          donation.status = "accepted"; // Mark incomplete
      } else {
          return res.status(400).json({ error: "Invalid status transition" });
      }

      await donation.save();
      res.json({ message: "Donation status updated", donation });
  } catch (error) {
      console.error("Error updating donation status:", error);
      res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
