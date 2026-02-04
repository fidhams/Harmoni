// utils/donationHelpers.js - Functions for donation-related badge updates
const Donor = require('../models/donor');
const BadgeService = require('../services/BadgeService');

// Update donor stats after donation
async function updateDonorAfterDonation(donorId, donationAmount) {
    try {
        // Update donor stats
        await Donor.findByIdAndUpdate(donorId, {
            $inc: {
                totalDonated: donationAmount,
                donationCount: 1
            }
        });
        
        // Check and award badges
        const newBadges = await BadgeService.checkAndAwardBadges(donorId);
        return newBadges;
    } catch (error) {
        console.error("Error updating donor after donation:", error);
        throw error;
    }
}

module.exports = {
    updateDonorAfterDonation
};