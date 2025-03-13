//for tracking
const mongoose = require("mongoose");

const AnalyticsSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    donationsMade: { type: Number, default: 0 },
    hoursVolunteered: { type: Number, default: 0 },
    eventsParticipated: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Analytics", AnalyticsSchema);
