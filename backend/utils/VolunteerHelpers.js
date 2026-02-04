// utils/volunteerHelpers.js - Functions for volunteer-related badge updates
const Donor = require('../models/donor');
const BadgeService = require('../services/BadgeService');

// Update volunteer activities
async function updateVolunteerActivity(donorId, hours, isNewEvent = true) {
    try {
        const updateData = { $inc: { volunteerHours: hours } };
        
        // If this is a new event, increment the event counter
        if (isNewEvent) {
            updateData.$inc.volunteerEvents = 1;
        }
        
        await Donor.findByIdAndUpdate(donorId, updateData);
        
        // Check and award badges
        const newBadges = await BadgeService.checkAndAwardBadges(donorId);
        return newBadges;
    } catch (error) {
        console.error("Error updating volunteer activity:", error);
        throw error;
    }
}

module.exports = {
    updateVolunteerActivity
};