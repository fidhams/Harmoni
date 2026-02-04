// models/BadgeProgress.js - Progress tracking for badges
const mongoose = require("mongoose");

const badgeProgressSchema = new mongoose.Schema({
    donorId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "donor", 
        required: true 
    },
    badgeId: { 
        type: String, 
        required: true 
    },
    currentProgress: { type: Number, default: 0 },
    targetValue: { type: Number, required: true },
    percentComplete: { type: Number, default: 0 },
    updatedAt: { type: Date, default: Date.now }
});

// Create a compound index for efficient lookups
badgeProgressSchema.index({ donorId: 1, badgeId: 1 }, { unique: true });

module.exports = mongoose.model("BadgeProgress", badgeProgressSchema);