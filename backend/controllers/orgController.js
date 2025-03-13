const Event = require("../models/Event"); // Model for organization events
const VolunteerRequest = require("../models/VolunteerRequest"); // Model for volunteer requests
const Need = require("../models/Need"); // Model for organizational needs

// Controller to create a new event
const createEvent = async (req, res) => {
    try {
        const { title, description, date, location, organization } = req.body;

        const event = new Event({
            title,
            description,
            date,
            location,
            organization,
        });

        await event.save();
        res.status(201).json({ message: "Event created successfully!", event });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Controller to get all events
const getEvents = async (req, res) => {
    try {
        const events = await Event.find().populate("organization", "name");
        res.status(200).json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Controller for organizations to request volunteers
const requestVolunteers = async (req, res) => {
    try {
        const { event, skillsRequired, organization } = req.body;

        const volunteerRequest = new VolunteerRequest({
            event,
            skillsRequired,
            organization,
        });

        await volunteerRequest.save();
        res.status(201).json({
            message: "Volunteer request created successfully!",
            volunteerRequest,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Controller to get organization-specific needs
const getOrganizationNeeds = async (req, res) => {
    try {
        const needs = await Need.find({ organization: req.query.organizationId });
        res.status(200).json(needs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { createEvent, getEvents, requestVolunteers, getOrganizationNeeds };
