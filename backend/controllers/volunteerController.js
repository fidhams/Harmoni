const VolunteerRequest = require("../models/VolunteerRequest");

const createVolunteerRequest = async (req, res) => {
    try {
        const { event, organization, details, requiredVolunteers } = req.body;

        const volunteerRequest = new VolunteerRequest({
            event,
            organization,
            details,
            requiredVolunteers,
            createdBy: req.user._id,
        });

        await volunteerRequest.save();
        res.status(201).json({ message: "Volunteer request created successfully", volunteerRequest });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getVolunteerRequests = async (req, res) => {
    try {
        const volunteerRequests = await VolunteerRequest.find()
            .populate("event", "name date")
            .populate("organization", "name");

        res.status(200).json(volunteerRequests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const respondToVolunteer = async (req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params;

        const volunteerRequest = await VolunteerRequest.findById(id);
        if (!volunteerRequest) return res.status(404).json({ message: "Volunteer request not found" });

        if (!["approved", "rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        volunteerRequest.responses.push({ user: req.user._id, status });
        await volunteerRequest.save();

        res.status(200).json({ message: "Response recorded", volunteerRequest });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { createVolunteerRequest, getVolunteerRequests, respondToVolunteer };
