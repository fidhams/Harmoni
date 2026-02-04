// models/DonorBadge.js - Earned badges mapping
const mongoose = require("mongoose");

const donorBadgeSchema = new mongoose.Schema({
    donorId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "donor", 
        required: true 
    },
    badgeId: { 
        type: String, 
        required: true 
    },
    earnedAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Create a compound index to ensure a donor can't have the same badge twice
donorBadgeSchema.index({ donorId: 1, badgeId: 1 }, { unique: true });

module.exports = mongoose.model("DonorBadge", donorBadgeSchema);