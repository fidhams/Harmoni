//The Donation model tracks donated items.
const mongoose = require("mongoose");

const DonationSchema = new mongoose.Schema({
    donor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    item: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    description: { type: String },
    status: { type: String, enum: ["pending", "accepted", "completed"], default: "pending" },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Organization that accepts the donation
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Donation", DonationSchema);
