const mongoose = require("mongoose");

const DonationSchema = new mongoose.Schema({
    donor: { type: mongoose.Schema.Types.ObjectId, ref: "Donor", required: true },
    item: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    description: { type: String },
    image: { type: String }, // ✅ Store image as filename (not binary data)
    status: { type: String, enum: ["pending", "accepted", "completed"], default: "pending" },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: "Donee", default: null },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Donation", DonationSchema);
