const mongoose = require("mongoose");

const volunteerRequestSchema = new mongoose.Schema({
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Assuming `User` is used for organizations
    details: { type: String, required: true },
    requiredVolunteers: { type: Number, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    responses: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            status: { type: String, enum: ["approved", "rejected"], required: true },
        },
    ],
}, { timestamps: true });

module.exports = mongoose.model("VolunteerRequest", volunteerRequestSchema);
