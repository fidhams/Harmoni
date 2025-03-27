const express = require("express");
const Message = require("../models/Message");
const router = express.Router();

// Save message
router.post("/", async (req, res) => {
    try {
        const { senderType, senderId, receiverType, receiverId, message } = req.body;

        const room = [senderType + senderId, receiverType + receiverId].sort().join("_"); // Ensure unique room ID

        const newMessage = new Message({ senderType, senderId, receiverType, receiverId, message, room });
        await newMessage.save();

        res.status(201).json(newMessage);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Fetch chat history
router.get("/:room", async (req, res) => {
    try {
        const messages = await Message.find({ room: req.params.room }).sort({ timestamp: 1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
