const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const Donor = require("../models/donor");


router.get("/volunteer-events", async (req, res) => {
    try {
        const today = new Date();
        const events = await Event.find({ 
            volunteerRequest: true, 
            date: { $gte: today } 
        }).populate("donee", "name phone")
        .populate("volunteers", "_id name");

        res.json(events);
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
});

router.patch("/apply/:eventId", async (req, res) => {
    const { eventId } = req.params;
    const { donorId } = req.body;

    try {
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ error: "Event not found" });

        if (event.volunteers.includes(donorId)) {
            return res.status(400).json({ error: "Already applied" });
        }

        event.volunteers.push(donorId);
        await event.save();

        await Donor.findByIdAndUpdate(donorId, { $push: { volunteering: event._id } });

        res.json({ success: true, message: "Applied successfully" });
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
});

module.exports = router;