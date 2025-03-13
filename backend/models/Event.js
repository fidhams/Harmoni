//The Event model tracks events posted by organizations.
const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    volunteerCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Event", EventSchema);
