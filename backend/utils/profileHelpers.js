// utils/profileHelpers.js - Functions for profile-related badge updates
const Donor = require('../models/donor');
const BadgeService = require('../services/BadgeService');

// Update profile completion percentage
async function updateProfileCompletion(donorId) {
    try {
        const donor = await Donor.findById(donorId);
        if (!donor) {
            throw new Error("Donor not found");
        }
        
        // Fields to check for profile completion
        const requiredFields = ['name', 'email', 'phone'];
        const optionalFields = ['address', 'description'];
        const arrayFields = ['skills'];
        
        let completedFields = 0;
        const totalFields = requiredFields.length + optionalFields.length + arrayFields.length;
        
        // Count completed required fields
        requiredFields.forEach(field => {
            if (donor[field] && donor[field].toString().trim() !== '') {
                completedFields++;
            }
        });
        
        // Count completed optional fields
        optionalFields.forEach(field => {
            if (donor[field] && donor[field].toString().trim() !== '') {
                completedFields++;
            }
        });
        
        // Count array fields with at least one item
        arrayFields.forEach(field => {
            if (donor[field] && donor[field].length > 0) {
                completedFields++;
            }
        });
        
        // Calculate percentage
        const percentage = Math.floor((completedFields / totalFields) * 100);
        
        // Update donor profile completion percentage
        await Donor.findByIdAndUpdate(donorId, {
            profileCompletionPercentage: percentage
        });
        
        // Check and award badges
        const newBadges = await BadgeService.checkAndAwardBadges(donorId);
        return newBadges;
    } catch (error) {
        console.error("Error updating profile completion:", error);
        throw error;
    }
}

module.exports = {
    updateProfileCompletion
};