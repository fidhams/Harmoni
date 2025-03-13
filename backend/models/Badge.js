//for gamification
const mongoose = require("mongoose");

const BadgeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    criteria: { type: String }, // How to earn this badge
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Badge", BadgeSchema);
