const mongoose = require("mongoose");

const ChatInitiationSchema = new mongoose.Schema({
    doneeId: { type: mongoose.Schema.Types.ObjectId, ref: "donee", required: true },
    donorId: { type: mongoose.Schema.Types.ObjectId, ref: "donor", required: true },
    blocked: { type: Boolean, default: false },
    initiatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ChatInitiation", ChatInitiationSchema);
