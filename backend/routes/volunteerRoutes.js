const express = require("express");
const { createVolunteerRequest, getVolunteerRequests, respondToVolunteer } = require("../controllers/volunteerController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", protect, createVolunteerRequest); // Create a volunteer request
router.get("/", protect, getVolunteerRequests);   // Get all volunteer requests
router.put("/:id/respond", protect, respondToVolunteer); // Respond to a volunteer request

module.exports = router;
