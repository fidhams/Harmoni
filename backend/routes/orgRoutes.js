const express = require("express");
const {
    createEvent,
    getEvents,
    requestVolunteers,
    getOrganizationNeeds,
} = require("../controllers/orgController");

const router = express.Router();

// Route to create a new event
router.post("/events", createEvent);

// Route to get all events
router.get("/events", getEvents);

// Route for organizations to request volunteers
router.post("/volunteers/request", requestVolunteers);

// Route to get organization-specific needs
router.get("/needs", getOrganizationNeeds);

module.exports = router;
