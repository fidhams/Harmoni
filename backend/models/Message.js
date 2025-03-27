const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
    senderType: { type: String, enum: ["donor", "donee"], required: true }, // Identifies sender type
    senderId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "senderType" },
    receiverType: { type: String, enum: ["donor", "donee"], required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "receiverType" },
    message: { type: String, required: true },
    room: { type: String, required: true }, // Unique room ID
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Message", MessageSchema);
