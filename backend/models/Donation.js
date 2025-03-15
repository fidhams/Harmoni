const mongoose = require("mongoose");

const DonationSchema = new mongoose.Schema({
    donor: { type: mongoose.Schema.Types.ObjectId, ref: "Donor", required: true },
    item: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    description: { type: String },
    image: { 
        data: Buffer, 
        contentType: String 
    }, // Store image as binary data
    status: { type: String, enum: ["pending", "accepted", "completed"], default: "pending" },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: "Donee", default: null }, // Organization that accepts the donation
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Donation", DonationSchema);
