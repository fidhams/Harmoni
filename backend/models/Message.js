const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
    senderType: { type: String, enum: ["donor", "donee"], required: true }, // Identifies sender type
    senderId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "senderType" },
    sender: { type: String }, // Sender's name
    receiverType: { type: String, enum: ["donor", "donee"], required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "receiverType" },
    receiver: { type: String }, // Receiver's name
    message: { type: String, required: true },
    room: { type: String, required: true }, // Unique room ID
    read: { type: Boolean, default: false }, // Read status
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Message", MessageSchema);
